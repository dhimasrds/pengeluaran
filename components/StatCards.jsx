import React from 'react';
import { Card } from './Card';
import { ProgressBar } from './Progress';
import { Skeleton } from './Skeleton';

/**
 * StatCard - Kartu statistik dengan progress bar opsional
 * @param {string} label - Label KPI
 * @param {string} value - Nilai utama
 * @param {string} subValue - Nilai tambahan (opsional)
 * @param {number} progress - 0-100 untuk progress bar
 * @param {('default'|'success'|'warning'|'error')} progressVariant
 * @param {boolean} loading
 */
export function StatCard({
  label,
  value,
  subValue,
  progress,
  progressVariant = 'default',
  loading = false,
  className = ''
}) {
  if (loading) {
    return (
      <Card className={className}>
        <Skeleton variant="text" className="w-24 mb-8" />
        <Skeleton variant="text" className="w-32 h-24 mb-8" />
        {progress !== undefined && <Skeleton variant="rect" className="w-full h-8" />}
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="space-y-8">
        <p className="text-sm font-medium text-text-secondary">{label}</p>
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-bold text-text-primary">{value}</p>
          {subValue && (
            <p className="text-sm text-text-muted">{subValue}</p>
          )}
        </div>
        {progress !== undefined && (
          <ProgressBar value={progress} variant={progressVariant} />
        )}
      </div>
    </Card>
  );
}

/**
 * StatCards - Grid 3 kartu KPI
 */
export function StatCards({ totalPengeluaran, sisaLimit, utilisasi, limitBulanan, loading }) {
  // Tentukan variant progress berdasarkan utilisasi
  const getProgressVariant = (util) => {
    if (util >= 100) return 'error';
    if (util >= 80) return 'warning';
    return 'success';
  };

  // Format Rupiah
  const formatRupiah = (num) => {
    if (num === null || num === undefined) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
      <StatCard
        label="Total Pengeluaran"
        value={formatRupiah(totalPengeluaran)}
        loading={loading}
      />
      <StatCard
        label="Sisa Limit"
        value={sisaLimit !== null ? formatRupiah(sisaLimit) : '-'}
        subValue={limitBulanan ? `dari ${formatRupiah(limitBulanan)}` : null}
        loading={loading}
      />
      <StatCard
        label="Utilisasi Limit"
        value={utilisasi !== null ? `${utilisasi.toFixed(1)}%` : '-'}
        progress={utilisasi}
        progressVariant={getProgressVariant(utilisasi)}
        loading={loading}
      />
    </div>
  );
}

