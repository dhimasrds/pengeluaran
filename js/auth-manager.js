/**
 * AuthManager - Handles authentication operations
 */
export class AuthManager {
  constructor(firebaseService) {
    this.firebaseService = firebaseService;
    this.auth = null;
    this.onAuthStateChanged = null;
    this.SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  }

  async initialize() {
    this.auth = this.firebaseService.getAuth();
    
    // Set up auth state listener
    const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
    this.onAuthStateChanged = onAuthStateChanged;
  }

  // Set up authentication state listener
  setAuthStateListener(callback) {
    if (this.onAuthStateChanged && this.auth) {
      this.onAuthStateChanged(this.auth, callback);
    }
  }

  // Check if session is still valid (within 24 hours)
  isSessionValid() {
    const loginTime = localStorage.getItem('loginTime');
    if (!loginTime) return false;
    
    const currentTime = new Date().getTime();
    const sessionAge = currentTime - parseInt(loginTime);
    
    return sessionAge < this.SESSION_DURATION;
  }

  // Save login timestamp
  saveLoginTime() {
    localStorage.setItem('loginTime', new Date().getTime().toString());
  }

  // Clear login timestamp
  clearLoginTime() {
    localStorage.removeItem('loginTime');
  }

  // Get remaining session time in hours
  getRemainingSessionTime() {
    const loginTime = localStorage.getItem('loginTime');
    if (!loginTime) return 0;
    
    const currentTime = new Date().getTime();
    const sessionAge = currentTime - parseInt(loginTime);
    const remainingTime = this.SESSION_DURATION - sessionAge;
    
    return Math.max(0, Math.floor(remainingTime / (60 * 60 * 1000))); // Return hours
  }

  async login(email, password) {
    const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      this.saveLoginTime(); // Save login timestamp
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async logout() {
    const { signOut } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
    try {
      await signOut(this.auth);
      this.clearLoginTime(); // Clear login timestamp
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getCurrentUser() {
    return this.auth?.currentUser;
  }

  getCurrentUserId() {
    return this.getCurrentUser()?.uid;
  }
}
