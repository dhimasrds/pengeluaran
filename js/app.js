/**
 * Main App class - Orchestrates all components
 */
import { FirebaseService } from './firebase-service.js';
import { AuthManager } from './auth-manager.js';
import { ExpenseManager } from './expense-manager.js';
import { LimitManager } from './limit-manager.js';
import { UIManager } from './ui-manager.js';

export class App {
  constructor() {
    this.firebaseService = new FirebaseService();
    this.authManager = new AuthManager(this.firebaseService);
    this.expenseManager = new ExpenseManager(this.firebaseService, this.authManager);
    this.limitManager = new LimitManager(this.firebaseService, this.authManager);
    this.uiManager = new UIManager();
    this.sessionTimer = null;
  }

  async initialize() {
    try {
      await this.firebaseService.initialize();
      await this.authManager.initialize();
      await this.expenseManager.initialize();
      await this.limitManager.initialize();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Set up authentication state listener for session persistence
      this.setupAuthStateListener();
      
      console.log('App initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  }

  setupAuthStateListener() {
    this.authManager.setAuthStateListener((user) => {
      if (user) {
        // Check if session is still valid (within 24 hours)
        if (this.authManager.isSessionValid()) {
          console.log('User is signed in and session is valid:', user.email);
          this.uiManager.showDashboard();
          this.loadSummary();
          this.loadExpenses();
          this.startSessionTimer();
          this.updateSessionStatus();
        } else {
          // Session expired, force logout
          console.log('Session expired, logging out user');
          this.authManager.logout();
          this.uiManager.showAlert('Sesi telah berakhir. Silakan login kembali.');
        }
      } else {
        // User is signed out, show login
        console.log('User is signed out');
        this.uiManager.showLogin();
        this.stopSessionTimer();
      }
    });
  }

  setupEventListeners() {
    // Sort change listener
    if (this.uiManager.elements.sortBy) {
      this.uiManager.elements.sortBy.addEventListener('change', () => {
        this.loadExpenses();
      });
    }
  }

  async login() {
    const email = this.uiManager.elements.email.value;
    const password = this.uiManager.elements.password.value;
    
    if (!email || !password) {
      this.uiManager.showAlert('Email dan password harus diisi!');
      return;
    }

    const result = await this.authManager.login(email, password);
    
    if (result.success) {
      // Auth state listener will automatically handle UI updates
      console.log('Login successful');
    } else {
      this.uiManager.showAlert('Login gagal: ' + result.error);
    }
  }

  async logout() {
    const result = await this.authManager.logout();
    
    if (result.success) {
      // Auth state listener will automatically handle UI updates
      console.log('Logout successful');
    } else {
      this.uiManager.showAlert('Logout gagal: ' + result.error);
    }
  }

  async saveLimit() {
    const month = this.uiManager.elements.bulan.value;
    const limit = parseInt(this.uiManager.elements.limit.value);
    
    if (!month || !limit) {
      this.uiManager.showAlert('Isi bulan dan limit!');
      return;
    }

    const result = await this.limitManager.saveLimit(month, limit);
    
    if (result.success) {
      this.uiManager.showAlert('Limit bulanan disimpan!');
      await this.loadSummary();
    } else {
      this.uiManager.showAlert('Gagal menyimpan limit: ' + result.error);
    }
  }

  async addExpense() {
    const expenseData = {
      tanggal: this.uiManager.elements.tanggal.value,
      kategori: this.uiManager.elements.kategori.value,
      catatan: this.uiManager.elements.catatan.value,
      nominal: parseInt(this.uiManager.elements.nominal.value)
    };

    if (!expenseData.tanggal || !expenseData.nominal) {
      this.uiManager.showAlert('Tanggal & nominal wajib diisi');
      return;
    }

    const result = await this.expenseManager.addExpense(expenseData);
    
    if (result.success) {
      this.uiManager.clearExpenseForm();
      await this.loadSummary();
      await this.loadExpenses();
    } else {
      this.uiManager.showAlert('Gagal menambah pengeluaran: ' + result.error);
    }
  }

  async deleteExpense(expenseId) {
    if (this.uiManager.showConfirm('Yakin ingin menghapus pengeluaran ini?')) {
      const result = await this.expenseManager.deleteExpense(expenseId);
      
      if (result.success) {
        await this.loadSummary();
        await this.loadExpenses();
      } else {
        this.uiManager.showAlert('Gagal menghapus pengeluaran: ' + result.error);
      }
    }
  }

  async loadSummary() {
    const currentMonth = this.uiManager.getCurrentMonth();
    this.uiManager.setCurrentMonth(currentMonth);

    // Get expenses for current month
    const expensesResult = await this.expenseManager.getExpenses(currentMonth);
    if (!expensesResult.success) {
      this.uiManager.showAlert('Gagal memuat data pengeluaran: ' + expensesResult.error);
      return;
    }

    const totalExpenses = this.expenseManager.calculateTotal(expensesResult.data);

    // Get limit for current month
    const limitResult = await this.limitManager.getLimit(currentMonth);
    if (!limitResult.success) {
      this.uiManager.showAlert('Gagal memuat data limit: ' + limitResult.error);
      return;
    }

    const limit = limitResult.limit || 0;
    const remainingLimit = this.limitManager.calculateRemainingLimit(limit, totalExpenses);
    const utilization = this.limitManager.calculateUtilization(totalExpenses, limit);

    this.uiManager.updateSummary(totalExpenses, remainingLimit, utilization);
  }

  async loadExpenses() {
    const currentMonth = this.uiManager.getCurrentMonth();
    const sortOption = this.uiManager.getSortOption();

    const result = await this.expenseManager.getExpenses(currentMonth);
    
    if (result.success) {
      const sortedExpenses = this.expenseManager.sortExpenses(result.data, sortOption);
      this.uiManager.updateExpenseTable(sortedExpenses);
    } else {
      this.uiManager.showAlert('Gagal memuat riwayat pengeluaran: ' + result.error);
    }
  }

  // Start session timer to check for expiration
  startSessionTimer() {
    this.stopSessionTimer(); // Clear any existing timer
    
    // Check session validity every minute
    this.sessionTimer = setInterval(() => {
      if (!this.authManager.isSessionValid()) {
        console.log('Session expired, forcing logout');
        this.authManager.logout();
        this.uiManager.showAlert('Sesi telah berakhir. Silakan login kembali.');
      } else {
        // Update session status display
        this.updateSessionStatus();
      }
    }, 60000); // Check every minute
  }

  // Update session status display
  updateSessionStatus() {
    const remainingHours = this.authManager.getRemainingSessionTime();
    this.uiManager.updateSessionStatus(remainingHours);
  }

  // Stop session timer
  stopSessionTimer() {
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
      this.sessionTimer = null;
    }
  }
}

// Global app instance
let app;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  app = new App();
  await app.initialize();
});

// Global functions for HTML onclick handlers
window.login = () => app.login();
window.logout = () => app.logout();
window.simpanLimit = () => app.saveLimit();
window.tambahPengeluaran = () => app.addExpense();
window.hapusPengeluaran = (id) => app.deleteExpense(id);
window.loadPengeluaran = () => app.loadExpenses();
