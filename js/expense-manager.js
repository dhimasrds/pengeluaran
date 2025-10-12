/**
 * ExpenseManager - Handles expense operations
 */
export class ExpenseManager {
  constructor(firebaseService, authManager) {
    this.firebaseService = firebaseService;
    this.authManager = authManager;
    this.db = null;
  }

  async initialize() {
    this.db = this.firebaseService.getDb();
  }

  async addExpense(expenseData) {
    const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    
    try {
      const expense = {
        uid: this.authManager.getCurrentUserId(),
        tanggal: expenseData.tanggal,
        kategori: expenseData.kategori,
        catatan: expenseData.catatan,
        nominal: expenseData.nominal,
        createdAt: new Date()
      };

      await addDoc(collection(this.db, "pengeluaran"), expense);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getExpenses(month) {
    const { collection, getDocs, query, where } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    
    try {
      const q = query(
        collection(this.db, "pengeluaran"), 
        where("uid", "==", this.authManager.getCurrentUserId())
      );
      const snap = await getDocs(q);
      
      let expenses = [];
      snap.forEach(doc => {
        const data = doc.data();
        if (data.tanggal.startsWith(month)) {
          expenses.push({
            id: doc.id,
            ...data
          });
        }
      });

      return { success: true, data: expenses };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteExpense(expenseId) {
    const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    
    try {
      await deleteDoc(doc(this.db, "pengeluaran", expenseId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  calculateTotal(expenses) {
    return expenses.reduce((total, expense) => total + expense.nominal, 0);
  }

  sortExpenses(expenses, sortOption) {
    return expenses.sort((a, b) => {
      switch (sortOption) {
        case "date-asc":
          return a.tanggal.localeCompare(b.tanggal);
        case "date-desc":
          return b.tanggal.localeCompare(a.tanggal);
        case "amount-asc":
          return a.nominal - b.nominal;
        case "amount-desc":
          return b.nominal - a.nominal;
        case "category-asc":
          return (a.kategori || "").localeCompare(b.kategori || "");
        default:
          return 0;
      }
    });
  }
}
