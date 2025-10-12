import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { Select } from './Select';
import { Input } from './Input';

/**
 * TransactionTable - Tabel transaksi dengan sticky header, filter, dan aksi
 */
export function TransactionTable({
  transactions = [],
  onEdit,
  onDelete,
  loading = false
}) {
  const [filterBulan, setFilterBulan] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Format Rupiah
  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Format tanggal
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  // Capitalize kategori
  const capitalizeCategory = (cat) => {
    return cat.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Filter dan sort
  const filteredTransactions = transactions
    .filter(t => !filterBulan || t.tanggal.startsWith(filterBulan))
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.tanggal) - new Date(a.tanggal);
        case 'date-asc':
          return new Date(a.tanggal) - new Date(b.tanggal);
        case 'amount-desc':
          return b.nominal - a.nominal;
        case 'amount-asc':
          return a.nominal - b.nominal;
        case 'category-asc':
          return a.kategori.localeCompare(b.kategori);
        default:
          return 0;
      }
    });

  const handleDelete = (id) => {
    onDelete(id);
    setDeleteConfirm(null);
  };

  if (loading) {
    return (
      <Card>
        <div className="space-y-12">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex space-x-12">
              <div className="h-16 bg-zinc-200 rounded w-24"></div>
              <div className="h-16 bg-zinc-200 rounded flex-1"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card
      header={
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          <h2 className="text-lg font-semibold text-text-primary">
            Riwayat Transaksi
          </h2>
          <div className="flex flex-col sm:flex-row gap-8 w-full md:w-auto">
            <Input
              type="month"
              value={filterBulan}
              onChange={(e) => setFilterBulan(e.target.value)}
              className="w-full sm:w-auto"
              placeholder="Filter bulan"
            />
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto"
            >
              <option value="date-desc">Terbaru</option>
              <option value="date-asc">Terlama</option>
              <option value="amount-desc">Terbesar</option>
              <option value="amount-asc">Terkecil</option>
              <option value="category-asc">Kategori A-Z</option>
            </Select>
          </div>
        </div>
      }
    >
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-32">
          <svg className="mx-auto h-48 w-48 text-text-muted mb-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-text-muted text-base">
            Belum ada transaksi di bulan ini.
          </p>
          <p className="text-text-muted text-sm mt-6">
            Tambahkan pengeluaran pertama Anda dengan formulir di atas.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-zinc-50 z-10">
              <tr>
                <th className="px-16 py-12 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider border-b border-border">
                  Tanggal
                </th>
                <th className="px-16 py-12 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider border-b border-border">
                  Kategori
                </th>
                <th className="px-16 py-12 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider border-b border-border hidden md:table-cell">
                  Catatan
                </th>
                <th className="px-16 py-12 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider border-b border-border">
                  Jumlah
                </th>
                <th className="px-16 py-12 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider border-b border-border">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border">
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-zinc-50 transition-colors duration-150 focus-within:bg-zinc-50"
                  tabIndex="0"
                >
                  <td className="px-16 py-12 whitespace-nowrap text-sm text-text-primary">
                    {formatDate(transaction.tanggal)}
                  </td>
                  <td className="px-16 py-12 whitespace-nowrap">
                    <Badge variant="default">
                      {capitalizeCategory(transaction.kategori)}
                    </Badge>
                  </td>
                  <td className="px-16 py-12 text-sm text-text-secondary hidden md:table-cell max-w-xs truncate">
                    {transaction.catatan}
                  </td>
                  <td className="px-16 py-12 whitespace-nowrap text-right text-sm font-semibold text-text-primary">
                    {formatRupiah(transaction.nominal)}
                  </td>
                  <td className="px-16 py-12 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end gap-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(transaction)}
                        aria-label={`Edit transaksi ${transaction.catatan}`}
                      >
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Button>
                      {deleteConfirm === transaction.id ? (
                        <div className="flex gap-4">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(transaction.id)}
                            aria-label="Konfirmasi hapus"
                          >
                            Ya
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirm(null)}
                            aria-label="Batal hapus"
                          >
                            Batal
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirm(transaction.id)}
                          className="text-destructive hover:bg-red-50"
                          aria-label={`Hapus transaksi ${transaction.catatan}`}
                        >
                          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

