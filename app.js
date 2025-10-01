// Konfigurasi Firebase (punyamu)
const firebaseConfig = {
  apiKey: "AIzaSyDlTuRouYleRsIqY1e0dVs0DdUn9vpGsaw",
  authDomain: "pengeluaran-83a36.firebaseapp.com",
  projectId: "pengeluaran-83a36",
  storageBucket: "pengeluaran-83a36.firebasestorage.app",
  messagingSenderId: "1092761187117",
  appId: "1:1092761187117:web:0acba9a85b81f1b0c9d9a4",
  measurementId: "G-LKF5YFEC8P"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Login
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("login-section").style.display = "none";
      document.getElementById("dashboard").style.display = "block";
      loadPengeluaran();
    })
    .catch(err => alert(err.message));
}

// Logout
function logout() {
  auth.signOut().then(() => {
    document.getElementById("login-section").style.display = "block";
    document.getElementById("dashboard").style.display = "none";
  });
}

// Tambah Pengeluaran
function tambahPengeluaran() {
  const data = {
    tanggal: document.getElementById("tanggal").value,
    kategori: document.getElementById("kategori").value,
    nominal: parseFloat(document.getElementById("nominal").value),
    catatan: document.getElementById("catatan").value,
    createdAt: new Date()
  };
  db.collection("pengeluaran").add(data).then(() => {
    loadPengeluaran();
  });
}

// Load Data
function loadPengeluaran() {
  db.collection("pengeluaran").orderBy("tanggal", "desc").get()
    .then(snapshot => {
      let total = 0;
      let list = "";
      snapshot.forEach(doc => {
        const p = doc.data();
        total += p.nominal;
        list += `<li>${p.tanggal} - ${p.kategori}: Rp${p.nominal} (${p.catatan})</li>`;
      });
      document.getElementById("list-pengeluaran").innerHTML = list;
      updateProgress(total);
    });
}

// Update Progress Bar
const LIMIT = 3000000; // contoh limit bulanan Rp 3jt
function updateProgress(total) {
  const persen = Math.min((total / LIMIT) * 100, 100);
  document.getElementById("progress").style.width = persen + "%";
  document.getElementById("limit-info").innerText =
    `Total bulan ini: Rp${total} / Rp${LIMIT}`;
}
