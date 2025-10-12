/**
 * FirebaseService - Handles all Firebase configuration and initialization
 */
export class FirebaseService {
  constructor() {
    this.config = {
      apiKey: "AIzaSyDlTuRouYleRsIqY1e0dVs0DdUn9vpGsaw",
      authDomain: "pengeluaran-83a36.firebaseapp.com",
      projectId: "pengeluaran-83a36",
      storageBucket: "pengeluaran-83a36.firebasestorage.app",
      messagingSenderId: "1092761187117",
      appId: "1:1092761187117:web:0acba9a85b81f1b0c9d9a4",
      measurementId: "G-LKF5YFEC8P"
    };
    
    this.app = null;
    this.auth = null;
    this.db = null;
  }

  async initialize() {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js");
    const { getAuth } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
    const { getFirestore } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");

    this.app = initializeApp(this.config);
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
  }

  getAuth() {
    return this.auth;
  }

  getDb() {
    return this.db;
  }
}
