/**
 * Global Functions Adapter
 * Menghubungkan onclick handlers di HTML dengan App class
 */

let appInstance = null;

// Inisialisasi app saat DOM ready
import { App } from './app.js';

document.addEventListener('DOMContentLoaded', async () => {
  appInstance = new App();
  await appInstance.initialize();
});

// Global functions untuk onclick handlers
window.login = function() {
  if (appInstance) {
    appInstance.login();
  }
};

window.logout = function() {
  if (appInstance && confirm('Yakin ingin keluar?')) {
    appInstance.logout();
  }
};

window.simpanLimit = function() {
  if (appInstance) {
    appInstance.saveLimit();
  }
};

window.simpanLimitDesktop = function() {
  // Ambil value dari desktop form
  const bulan = document.getElementById('bulanDesktop').value;
  const limit = document.getElementById('limitDesktop').value;

  // Set ke form utama
  document.getElementById('bulan').value = bulan;
  document.getElementById('limit').value = limit;

  if (appInstance) {
    appInstance.saveLimit();
  }
};

window.tambahPengeluaran = function() {
  if (appInstance) {
    appInstance.addExpense();
  }
};

window.tambahPengeluaranDesktop = function() {
  // Sync desktop form ke mobile form
  document.getElementById('tanggal').value = document.getElementById('tanggalDesktop').value;
  document.getElementById('kategori').value = document.getElementById('kategoriDesktop').value;
  document.getElementById('catatan').value = document.getElementById('catatanDesktop').value;
  document.getElementById('nominal').value = document.getElementById('nominalDesktop').value;

  if (appInstance) {
    appInstance.addExpense();
  }
};

window.hapusPengeluaran = function(id) {
  if (appInstance && confirm('Yakin ingin menghapus transaksi ini?')) {
    appInstance.deleteExpense(id);
  }
};

window.editPengeluaran = function(id) {
  if (appInstance) {
    appInstance.editExpense(id);
  }
};

window.eksporCSV = function() {
  if (appInstance) {
    appInstance.exportToCSV();
  }
};

window.kirimEmail = function() {
  if (appInstance) {
    appInstance.sendEmail();
  }
};

window.toggleSecondaryMenu = function() {
  const menu = document.getElementById('secondaryMenu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
};

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
  const menu = document.getElementById('secondaryMenu');
  const button = event.target.closest('button');
  if (menu && !menu.classList.contains('hidden')) {
    if (!button || !button.onclick || !button.onclick.toString().includes('toggleSecondaryMenu')) {
      menu.classList.add('hidden');
    }
  }
});

