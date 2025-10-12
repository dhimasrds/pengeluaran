/**
 * UIManager - Handles all UI interactions and DOM manipulation
 */
export class UIManager {
  constructor() {
    this.elements = {};
    this.initializeElements();
  }

  initializeElements() {
    // Loading elements
    this.elements.loadingSection = document.getElementById('loading-section');
    
    // Login elements
    this.elements.loginSection = document.getElementById('login-section');
    this.elements.dashboard = document.getElementById('dashboard');
    this.elements.email = document.getElementById('email');
    this.elements.password = document.getElementById('password');

    // Initially show loading, hide others until auth state is determined
    this.elements.loadingSection.style.display = "flex";
    this.elements.loginSection.style.display = "none";
    this.elements.dashboard.style.display = "none";

    // Dashboard elements
    this.elements.totalPengeluaran = document.getElementById('totalPengeluaran');
    this.elements.sisaLimit = document.getElementById('sisaLimit');
    this.elements.utilisasi = document.getElementById('utilisasi');
    this.elements.bulan = document.getElementById('bulan');
    this.elements.limit = document.getElementById('limit');

    // Expense form elements
    this.elements.tanggal = document.getElementById('tanggal');
    this.elements.kategori = document.getElementById('kategori');
    this.elements.catatan = document.getElementById('catatan');
    this.elements.nominal = document.getElementById('nominal');

    // Table elements
    this.elements.tabelPengeluaran = document.getElementById('tabelPengeluaran');
    this.elements.sortBy = document.getElementById('sortBy');

    // Session status element
    this.elements.sessionStatus = document.getElementById('session-status');

    // Set default date
    this.elements.tanggal.value = new Date().toISOString().split("T")[0];
  }

  showLoading() {
    this.elements.loadingSection.style.display = "flex";
    this.elements.loginSection.style.display = "none";
    this.elements.dashboard.style.display = "none";
  }

  showLogin() {
    this.elements.loadingSection.style.display = "none";
    this.elements.loginSection.style.display = "flex";
    this.elements.dashboard.style.display = "none";
  }

  showDashboard() {
    this.elements.loadingSection.style.display = "none";
    this.elements.loginSection.style.display = "none";
    this.elements.dashboard.style.display = "block";
  }

  updateSummary(totalExpenses, remainingLimit, utilization) {
    this.elements.totalPengeluaran.innerText = "Rp" + totalExpenses.toLocaleString();
    this.elements.sisaLimit.innerText = remainingLimit !== null ? "Rp" + remainingLimit.toLocaleString() : "-";
    this.elements.utilisasi.innerText = utilization + "%";
  }

  updateExpenseTable(expenses) {
    if (expenses.length === 0) {
      this.elements.tabelPengeluaran.innerHTML = 
        '<tr><td colspan="5" class="text-center text-gray-500 p-4">Belum ada data</td></tr>';
      return;
    }

    let rows = "";
    expenses.forEach(expense => {
      rows += `
        <tr>
          <td class="border p-2">${expense.tanggal}</td>
          <td class="border p-2">${expense.kategori}</td>
          <td class="border p-2">${expense.catatan || "-"}</td>
          <td class="border p-2">Rp${expense.nominal.toLocaleString()}</td>
          <td class="border p-2 text-red-500 cursor-pointer" onclick="app.deleteExpense('${expense.id}')">Hapus</td>
        </tr>`;
    });

    this.elements.tabelPengeluaran.innerHTML = rows;
  }

  clearExpenseForm() {
    this.elements.catatan.value = "";
    this.elements.nominal.value = "";
  }

  getCurrentMonth() {
    return this.elements.bulan.value || new Date().toISOString().slice(0, 7);
  }

  setCurrentMonth(month) {
    this.elements.bulan.value = month;
  }

  getSortOption() {
    return this.elements.sortBy?.value || "date-desc";
  }

  showAlert(message, type = 'info') {
    alert(message);
  }

  showConfirm(message) {
    return confirm(message);
  }

  // Update session status display
  updateSessionStatus(remainingHours) {
    if (this.elements.sessionStatus) {
      if (remainingHours > 0) {
        this.elements.sessionStatus.innerText = `Sesi aktif: ${remainingHours} jam tersisa`;
        this.elements.sessionStatus.className = "text-sm text-green-600";
      } else {
        this.elements.sessionStatus.innerText = "Sesi akan segera berakhir";
        this.elements.sessionStatus.className = "text-sm text-red-600";
      }
    }
  }
}
