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

    // Dashboard elements (Mobile)
    this.elements.totalPengeluaran = document.getElementById('totalPengeluaran');
    this.elements.sisaLimit = document.getElementById('sisaLimit');
    this.elements.utilisasi = document.getElementById('utilisasi');
    this.elements.progressBar = document.getElementById('progressBar');

    // Dashboard elements (Desktop)
    this.elements.totalPengeluaranDesktop = document.getElementById('totalPengeluaranDesktop');
    this.elements.sisaLimitDesktop = document.getElementById('sisaLimitDesktop');
    this.elements.utilisasiDesktop = document.getElementById('utilisasiDesktop');
    this.elements.progressBarDesktop = document.getElementById('progressBarDesktop');

    // Form elements
    this.elements.bulan = document.getElementById('bulan');
    this.elements.limit = document.getElementById('limit');
    this.elements.tanggal = document.getElementById('tanggal');
    this.elements.kategori = document.getElementById('kategori');
    this.elements.catatan = document.getElementById('catatan');
    this.elements.nominal = document.getElementById('nominal');

    // Desktop form elements
    this.elements.bulanDesktop = document.getElementById('bulanDesktop');
    this.elements.limitDesktop = document.getElementById('limitDesktop');
    this.elements.tanggalDesktop = document.getElementById('tanggalDesktop');
    this.elements.kategoriDesktop = document.getElementById('kategoriDesktop');
    this.elements.catatanDesktop = document.getElementById('catatanDesktop');
    this.elements.nominalDesktop = document.getElementById('nominalDesktop');

    // Table elements
    this.elements.tabelPengeluaran = document.getElementById('tabelPengeluaran');
    this.elements.tabelPengeluaranDesktop = document.getElementById('tabelPengeluaranDesktop');
    this.elements.sortBy = document.getElementById('sortBy');
    this.elements.sortByDesktop = document.getElementById('sortByDesktop');
    this.elements.filterBulan = document.getElementById('filterBulan');
    this.elements.filterBulanDesktop = document.getElementById('filterBulanDesktop');

    // Session status element
    this.elements.sessionStatus = document.getElementById('session-status');

    // Set default date untuk semua form
    const today = new Date().toISOString().split("T")[0];
    if (this.elements.tanggal) this.elements.tanggal.value = today;
    if (this.elements.tanggalDesktop) this.elements.tanggalDesktop.value = today;
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
    const formatRupiah = (num) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(num);
    };

    // Update mobile
    if (this.elements.totalPengeluaran) {
      this.elements.totalPengeluaran.innerText = formatRupiah(totalExpenses);
    }
    if (this.elements.sisaLimit) {
      this.elements.sisaLimit.innerText = remainingLimit !== null ? formatRupiah(remainingLimit) : "-";
    }
    if (this.elements.utilisasi) {
      this.elements.utilisasi.innerText = utilization !== null ? utilization.toFixed(1) + "%" : "0%";
    }

    // Update desktop
    if (this.elements.totalPengeluaranDesktop) {
      this.elements.totalPengeluaranDesktop.innerText = formatRupiah(totalExpenses);
    }
    if (this.elements.sisaLimitDesktop) {
      this.elements.sisaLimitDesktop.innerText = remainingLimit !== null ? formatRupiah(remainingLimit) : "-";
    }
    if (this.elements.utilisasiDesktop) {
      this.elements.utilisasiDesktop.innerText = utilization !== null ? utilization.toFixed(1) + "%" : "0%";
    }

    // Update progress bars
    this.updateProgressBar(utilization || 0);
  }

  updateProgressBar(percentage) {
    const clampedValue = Math.min(Math.max(percentage, 0), 100);

    // Update both progress bars
    [this.elements.progressBar, this.elements.progressBarDesktop].forEach(bar => {
      if (!bar) return;

      // Set width
      bar.style.width = clampedValue + '%';
      bar.setAttribute('aria-valuenow', clampedValue);

      // Update color based on utilization
      bar.classList.remove('bg-success', 'bg-warning', 'bg-destructive');
      if (clampedValue >= 100) {
        bar.classList.add('bg-destructive');
      } else if (clampedValue >= 80) {
        bar.classList.add('bg-warning');
      } else {
        bar.classList.add('bg-success');
      }
    });
  }

  updateExpenseTable(expenses) {
    const formatRupiah = (num) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(num);
    };

    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(date);
    };

    const capitalizeCategory = (cat) => {
      return cat.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    };

    if (expenses.length === 0) {
      const emptyHTML = `
        <tr>
          <td colspan="5" class="text-center text-text-muted py-32">
            <svg class="mx-auto h-48 w-48 text-text-muted mb-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-base">Belum ada transaksi di bulan ini.</p>
            <p class="text-sm mt-6">Tambahkan pengeluaran pertama Anda dengan formulir di atas.</p>
          </td>
        </tr>
      `;
      if (this.elements.tabelPengeluaran) this.elements.tabelPengeluaran.innerHTML = emptyHTML;
      if (this.elements.tabelPengeluaranDesktop) this.elements.tabelPengeluaranDesktop.innerHTML = emptyHTML;
      return;
    }

    let rowsMobile = "";
    let rowsDesktop = "";

    expenses.forEach(expense => {
      // Mobile version (tanpa catatan)
      rowsMobile += `
        <tr class="hover:bg-zinc-50 transition-colors duration-150" tabindex="0">
          <td class="px-16 py-12 whitespace-nowrap text-sm text-text-primary">${formatDate(expense.tanggal)}</td>
          <td class="px-16 py-12 whitespace-nowrap">
            <span class="inline-flex items-center px-8 py-4 text-xs font-medium rounded-md border bg-zinc-100 text-zinc-700 border-zinc-200">
              ${capitalizeCategory(expense.kategori)}
            </span>
          </td>
          <td class="px-16 py-12 text-sm text-text-secondary hidden md:table-cell max-w-xs truncate">${expense.catatan || '-'}</td>
          <td class="px-16 py-12 whitespace-nowrap text-right text-sm font-semibold text-text-primary">${formatRupiah(expense.nominal)}</td>
          <td class="px-16 py-12 whitespace-nowrap text-right text-sm">
            <div class="flex justify-end gap-6">
              <button onclick="editPengeluaran('${expense.id}')"
                class="text-text-secondary hover:bg-zinc-100 p-6 rounded-lg transition-all duration-150"
                aria-label="Edit transaksi">
                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button onclick="hapusPengeluaran('${expense.id}')"
                class="text-destructive hover:bg-red-50 p-6 rounded-lg transition-all duration-150"
                aria-label="Hapus transaksi">
                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;

      // Desktop version (dengan catatan)
      rowsDesktop += `
        <tr class="hover:bg-zinc-50 transition-colors duration-150" tabindex="0">
          <td class="px-16 py-12 whitespace-nowrap text-sm text-text-primary">${formatDate(expense.tanggal)}</td>
          <td class="px-16 py-12 whitespace-nowrap">
            <span class="inline-flex items-center px-8 py-4 text-xs font-medium rounded-md border bg-zinc-100 text-zinc-700 border-zinc-200">
              ${capitalizeCategory(expense.kategori)}
            </span>
          </td>
          <td class="px-16 py-12 text-sm text-text-secondary max-w-xs truncate">${expense.catatan || '-'}</td>
          <td class="px-16 py-12 whitespace-nowrap text-right text-sm font-semibold text-text-primary">${formatRupiah(expense.nominal)}</td>
          <td class="px-16 py-12 whitespace-nowrap text-right text-sm">
            <div class="flex justify-end gap-6">
              <button onclick="editPengeluaran('${expense.id}')"
                class="text-text-secondary hover:bg-zinc-100 p-6 rounded-lg transition-all duration-150"
                aria-label="Edit transaksi">
                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button onclick="hapusPengeluaran('${expense.id}')"
                class="text-destructive hover:bg-red-50 p-6 rounded-lg transition-all duration-150"
                aria-label="Hapus transaksi">
                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    if (this.elements.tabelPengeluaran) {
      this.elements.tabelPengeluaran.innerHTML = rowsMobile;
    }
    if (this.elements.tabelPengeluaranDesktop) {
      this.elements.tabelPengeluaranDesktop.innerHTML = rowsDesktop;
    }
  }

  clearExpenseForm() {
    // Clear mobile form
    if (this.elements.catatan) this.elements.catatan.value = "";
    if (this.elements.nominal) this.elements.nominal.value = "";

    // Clear desktop form
    if (this.elements.catatanDesktop) this.elements.catatanDesktop.value = "";
    if (this.elements.nominalDesktop) this.elements.nominalDesktop.value = "";
  }

  getCurrentMonth() {
    return this.elements.bulan?.value || new Date().toISOString().slice(0, 7);
  }

  setCurrentMonth(month) {
    if (this.elements.bulan) this.elements.bulan.value = month;
    if (this.elements.bulanDesktop) this.elements.bulanDesktop.value = month;
  }

  getSortOption() {
    return this.elements.sortBy?.value || this.elements.sortByDesktop?.value || "date-desc";
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
        this.elements.sessionStatus.className = "text-sm text-success";
      } else {
        this.elements.sessionStatus.innerText = "Sesi akan segera berakhir";
        this.elements.sessionStatus.className = "text-sm text-destructive";
      }
    }
  }
}
