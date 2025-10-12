/**
 * LimitManager - Handles monthly limit operations
 */
export class LimitManager {
  constructor(firebaseService, authManager) {
    this.firebaseService = firebaseService;
    this.authManager = authManager;
    this.db = null;
  }

  async initialize() {
    this.db = this.firebaseService.getDb();
  }

  async saveLimit(month, limit) {
    const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    
    try {
      const uid = this.authManager.getCurrentUserId();
      await setDoc(doc(this.db, "limits", uid + "_" + month), {
        uid,
        bulan: month,
        limit: limit
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getLimit(month) {
    const { collection, getDocs, query, where } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    
    try {
      const uid = this.authManager.getCurrentUserId();
      const q = query(
        collection(this.db, "limits"), 
        where("uid", "==", uid), 
        where("bulan", "==", month)
      );
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        return { success: true, limit: snap.docs[0].data().limit };
      }
      return { success: true, limit: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  calculateRemainingLimit(limit, totalExpenses) {
    if (!limit) return null;
    return limit - totalExpenses;
  }

  calculateUtilization(totalExpenses, limit) {
    if (!limit) return 0;
    // Return a number (not string). UI handles formatting.
    return (totalExpenses / Number(limit)) * 100;
  }
}
