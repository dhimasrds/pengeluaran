import React, { useState, useEffect } from 'react';
import { StatCards } from './components/StatCards';
import { LimitPanel } from './components/LimitPanel';
import { ExpenseForm } from './components/ExpenseForm';
import { TransactionTable } from './components/TransactionTable';
import { Button } from './components/Button';

/**
 * Dashboard - Main application component
 */
export function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [limitBulanan, setLimitBulanan] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Mock data untuk demo
  useEffect(() => {
    // Simulasi fetch data
    const mockTransactions = [
      {
        id: '1',
        tanggal: '2025-01-15',
        kategori: 'food & beverages',
        catatan: 'Makan siang di restoran',
        nominal: 75000,
      },
      {
        id: '2',
        tanggal: '2025-01-14',
        kategori: 'transportation',
        catatan: 'Bensin motor',
        nominal: 50000,
      },
      {
        id: '3',
        tanggal: '2025-01-13',
        kategori: 'entertainment',
        catatan: 'Nonton bioskop',
        nominal: 45000,
      },
    ];
    setTransactions(mockTransactions);
    setLimitBulanan(5000000);
  }, []);

  // Calculate stats
  const totalPengeluaran = transactions.reduce((sum, t) => sum + t.nominal, 0);
  const sisaLimit = limitBulanan ? limitBulanan - totalPengeluaran : null;
  const utilisasi = limitBulanan ? (totalPengeluaran / limitBulanan) * 100 : null;

  // Handlers
  const handleSaveLimit = ({ bulan, limit }) => {
    setLimitBulanan(limit);
    alert(`Limit bulan ${bulan} berhasil disimpan: Rp ${limit.toLocaleString('id-ID')}`);
  };

  const handleExport = () => {
    alert('Export CSV akan segera diunduh...');
    // Implementasi CSV export di sini
  };

  const handleSendEmail = () => {
    alert('Rekap akan dikirim ke email Anda...');
    // Implementasi send email di sini
  };

  const handleAddExpense = (formData) => {
    setLoading(true);
    setTimeout(() => {
      const newTransaction = {
        id: Date.now().toString(),
        ...formData,
        nominal: parseFloat(formData.nominal),
      };
      setTransactions([newTransaction, ...transactions]);
      setLoading(false);
      alert('Transaksi berhasil ditambahkan!');
    }, 500);
  };

  const handleEditExpense = (transaction) => {
    setEditingTransaction(transaction);
    // Scroll ke form
    document.getElementById('expense-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUpdateExpense = (formData) => {
    setLoading(true);
    setTimeout(() => {
      setTransactions(
        transactions.map((t) =>
          t.id === editingTransaction.id
            ? { ...t, ...formData, nominal: parseFloat(formData.nominal) }
            : t
        )
      );
      setEditingTransaction(null);
      setLoading(false);
      alert('Transaksi berhasil diperbarui!');
    }, 500);
  };

  const handleDeleteExpense = (id) => {
    setLoading(true);
    setTimeout(() => {
      setTransactions(transactions.filter((t) => t.id !== id));
      setLoading(false);
      alert('Transaksi berhasil dihapus!');
    }, 300);
  };

  const handleLogout = () => {
    if (confirm('Yakin ingin keluar?')) {
      // Implementasi logout
      alert('Logout berhasil!');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-surface border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-16 py-16 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Dashboard Pengeluaran
            </h1>
            <p className="text-sm text-text-secondary mt-4">
              Kelola keuangan bulanan Anda
            </p>
          </div>
          <Button variant="secondary" onClick={handleLogout} size="sm">
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-16 py-24">
        {/* Mobile: Stack Layout */}
        <div className="lg:hidden space-y-24">
          {/* Stats */}
          <StatCards
            totalPengeluaran={totalPengeluaran}
            sisaLimit={sisaLimit}
            utilisasi={utilisasi}
            limitBulanan={limitBulanan}
            loading={loading}
          />

          {/* Expense Form */}
          <div id="expense-form">
            <ExpenseForm
              onSubmit={editingTransaction ? handleUpdateExpense : handleAddExpense}
              initialData={editingTransaction}
              loading={loading}
            />
          </div>

          {/* Transaction Table */}
          <TransactionTable
            transactions={transactions}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
            loading={loading}
          />

          {/* Limit Panel */}
          <LimitPanel
            onSave={handleSaveLimit}
            onExport={handleExport}
            onSendEmail={handleSendEmail}
            loading={loading}
          />
        </div>

        {/* Desktop: 2-Column Layout */}
        <div className="hidden lg:grid lg:grid-cols-[360px_1fr] lg:gap-24">
          {/* Sidebar */}
          <div className="space-y-24">
            {/* Stats */}
            <div className="space-y-16">
              <StatCards
                totalPengeluaran={totalPengeluaran}
                sisaLimit={sisaLimit}
                utilisasi={utilisasi}
                limitBulanan={limitBulanan}
                loading={loading}
              />
            </div>

            {/* Limit Panel */}
            <LimitPanel
              onSave={handleSaveLimit}
              onExport={handleExport}
              onSendEmail={handleSendEmail}
              loading={loading}
            />

            {/* Expense Form */}
            <div id="expense-form">
              <ExpenseForm
                onSubmit={editingTransaction ? handleUpdateExpense : handleAddExpense}
                initialData={editingTransaction}
                loading={loading}
              />
            </div>
          </div>

          {/* Main Content */}
          <div>
            <TransactionTable
              transactions={transactions}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
              loading={loading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

