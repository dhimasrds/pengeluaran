import React, { useState } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Select } from './Select';
import { Button } from './Button';

/**
 * ExpenseForm - Form tambah/edit pengeluaran dengan validasi
 */
export function ExpenseForm({ onSubmit, initialData = null, loading = false }) {
  const [formData, setFormData] = useState({
    tanggal: initialData?.tanggal || new Date().toISOString().split('T')[0],
    kategori: initialData?.kategori || 'food & beverages',
    catatan: initialData?.catatan || '',
    nominal: initialData?.nominal || '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.tanggal) newErrors.tanggal = 'Tanggal wajib diisi';
    if (!formData.kategori) newErrors.kategori = 'Pilih kategori';
    if (!formData.catatan.trim()) newErrors.catatan = 'Tambahkan catatan singkat';
    if (!formData.nominal || formData.nominal <= 0) {
      newErrors.nominal = 'Masukkan jumlah yang valid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error saat user mulai mengetik
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ tanggal: true, kategori: true, catatan: true, nominal: true });

    if (validate()) {
      onSubmit(formData);
      // Reset form jika bukan edit mode
      if (!initialData) {
        setFormData({
          tanggal: new Date().toISOString().split('T')[0],
          kategori: 'food & beverages',
          catatan: '',
          nominal: '',
        });
        setTouched({});
      }
    }
  };

  const categories = [
    { value: 'food & beverages', label: 'Food & Beverages' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'groceries', label: 'Groceries' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'health', label: 'Health' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <Card
      header={
        <h2 className="text-lg font-semibold text-text-primary">
          {initialData ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}
        </h2>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Input
            type="date"
            label="Tanggal"
            value={formData.tanggal}
            onChange={(e) => handleChange('tanggal', e.target.value)}
            onBlur={() => handleBlur('tanggal')}
            errorText={touched.tanggal ? errors.tanggal : ''}
            required
          />

          <Select
            label="Kategori"
            value={formData.kategori}
            onChange={(e) => handleChange('kategori', e.target.value)}
            onBlur={() => handleBlur('kategori')}
            errorText={touched.kategori ? errors.kategori : ''}
            options={categories}
            required
          />

          <Input
            type="text"
            label="Catatan"
            placeholder="Contoh: Makan siang di restoran"
            value={formData.catatan}
            onChange={(e) => handleChange('catatan', e.target.value)}
            onBlur={() => handleBlur('catatan')}
            errorText={touched.catatan ? errors.catatan : ''}
            helperText="Deskripsi singkat transaksi"
            required
          />

          <Input
            type="number"
            label="Jumlah (Rp)"
            placeholder="Contoh: 50000"
            value={formData.nominal}
            onChange={(e) => handleChange('nominal', e.target.value)}
            onBlur={() => handleBlur('nominal')}
            errorText={touched.nominal ? errors.nominal : ''}
            helperText="Masukkan tanpa titik atau koma"
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full md:w-auto"
        >
          {initialData ? 'Simpan Perubahan' : 'Tambah Transaksi'}
        </Button>
      </form>
    </Card>
  );
}

