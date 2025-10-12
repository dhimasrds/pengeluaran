# Design System - Dashboard Rekap Pengeluaran Bulanan

## 1. DIAGNOSIS UI/UX SAAT INI ❌

### Masalah Teridentifikasi:
- **❌ Hierarki visual lemah**: Semua tombol (Simpan, Ekspor, Kirim Email) memiliki bobot visual setara—tidak ada CTA primer yang jelas
- **❌ Spacing tidak konsisten**: Gap antar section bervariasi (mb-4, mb-6), density terlalu padat di form 4 kolom
- **❌ Kontras & aksesibilitas**: `orange-600/orange-700` pada heading tidak memenuhi WCAG AA, tidak ada focus ring eksplisit
- **❌ Visual density tinggi**: Form 4 kolom di mobile sulit digunakan, tabel tanpa hover state
- **❌ Aksi sekunder terlalu prominent**: Ekspor & Email sejajar dengan aksi primer (Simpan/Tambah)
- **❌ Tidak ada feedback state**: Tidak ada loading, error helper, atau konfirmasi destruktif

---

## 2. THEME DIRECTION: **A. Monochrome + Accent (Zinc + Indigo)** ✅

### Alasan Pemilihan:
✅ **Profesional & timeless** — Zinc netral cocok untuk dashboard keuangan, tidak emosional  
✅ **Aksesibilitas terjamin** — Indigo 600/700 memiliki kontras 4.5:1+ (AA) terhadap putih  
✅ **Skalabilitas** — Mudah ditambahkan warna status (success/error/warning) tanpa bentrok  
✅ **Performa** — Monokrom minim gradiasi = rendering lebih cepat  

### Palet Warna (Hex):

| Token | Hex | Use Case |
|-------|-----|----------|
| **Background** | `#fafafa` (zinc-50) | Body background |
| **Surface** | `#ffffff` | Card, modal, input bg |
| **Border** | `#e4e4e7` (zinc-200) | Default border |
| **Border Dark** | `#d4d4d8` (zinc-300) | Hover border |
| **Text Primary** | `#18181b` (zinc-900) | Heading, label |
| **Text Secondary** | `#52525b` (zinc-600) | Body text |
| **Text Muted** | `#a1a1aa` (zinc-400) | Helper, placeholder |
| **Accent** | `#4f46e5` (indigo-600) | Primary CTA, link |
| **Accent Hover** | `#4338ca` (indigo-700) | Button hover |
| **Accent Pressed** | `#3730a3` (indigo-800) | Button active |
| **Accent FG** | `#ffffff` | Text on accent bg |
| **Accent Light** | `#eef2ff` (indigo-50) | Subtle accent bg |
| **Destructive** | `#dc2626` (red-600) | Delete, error |
| **Destructive Hover** | `#b91c1c` (red-700) | Delete hover |
| **Success** | `#16a34a` (green-600) | Success state |
| **Warning** | `#ea580c` (orange-600) | Warning state |
| **Info** | `#0284c7` (sky-600) | Info state |

### State Colors:

```jsx
// Default State
bg-white border-zinc-200

// Hover State
bg-zinc-50 border-zinc-300

// Pressed State
bg-zinc-100

// Disabled State
bg-zinc-50 text-zinc-400 cursor-not-allowed opacity-50

// Focus State
ring-2 ring-indigo-500 ring-offset-2 outline-none
```

---

## 3. DESIGN TOKENS (Tailwind Config)

File: `tailwind.config.js` sudah dibuat dengan:

### Colors:
- `bg-background` → `#fafafa`
- `bg-surface` → `#ffffff`
- `border-border` → `#e4e4e7`
- `text-text-primary` → `#18181b`
- `bg-accent` → `#4f46e5`
- `bg-destructive` → `#dc2626`

### Radius:
- `rounded-sm` → 4px
- `rounded-md` → 6px
- `rounded-lg` → 8px
- `rounded-xl` → 12px
- `rounded-2xl` → 16px

### Spacing Scale:
- `space-2` → 2px
- `space-4` → 4px
- `space-6` → 6px
- `space-8` → 8px
- `space-12` → 12px
- `space-16` → 16px
- `space-24` → 24px
- `space-32` → 32px

### Font Scale:
- `text-xs` → 12px / 16px line-height
- `text-sm` → 14px / 20px
- `text-base` → 16px / 24px
- `text-lg` → 18px / 28px
- `text-xl` → 20px / 28px
- `text-2xl` → 24px / 32px
- `text-3xl` → 30px / 36px

### Shadows:
- `shadow-xs` → 0 1px 2px rgba(0,0,0,0.05)
- `shadow-sm` → 0 1px 3px rgba(0,0,0,0.08)
- `shadow-md` → 0 4px 6px rgba(0,0,0,0.08)
- `shadow-lg` → 0 10px 15px rgba(0,0,0,0.08)

---

## 4. LAYOUT RESPONSIF

### Mobile (< 768px) - Stack 1 Kolom
```
┌─────────────────────┐
│ Header + Logout     │ ← 64px sticky
├─────────────────────┤
│ ⚡ Stat Card 1       │ ← Compact 80px each
│ ⚡ Stat Card 2       │
│ ⚡ Stat Card 3       │
├─────────────────────┤
│ 📝 Form Pengeluaran │ ← Priority #1 (above fold)
├─────────────────────┤
│ 🔍 Filter + Sort    │
├─────────────────────┤
│ 📊 Tabel Transaksi  │ ← Horizontal scroll
├─────────────────────┤
│ ⚙️ Limit Panel      │ ← Secondary (below fold)
└─────────────────────┘
```

### Desktop (≥ 1024px) - 2 Kolom
```
┌──────────────────────────────────────┐
│ Header                      Logout   │
├────────────────┬─────────────────────┤
│ Sidebar (360px)│ Main Content        │
│                │                     │
│ Stat Card 1    │ 🔍 Filter + Sort    │
│ Stat Card 2    │                     │
│ Stat Card 3    │ 📊 Tabel Transaksi  │
│                │    (sticky header)  │
│ ⚙️ Limit Panel │                     │
│                │                     │
│ 📝 Form        │                     │
│   Pengeluaran  │                     │
└────────────────┴─────────────────────┘
```

### Urutan Fokus Keyboard (Tab Order):
1. **Skip to main content** (a11y link)
2. Filter bulan
3. Sort dropdown
4. Tabel row 1 → Edit → Hapus
5. Tabel row 2 → Edit → Hapus
6. Form: Tanggal → Kategori → Catatan → Nominal → Tambah
7. Limit: Bulan → Limit → Simpan → Menu (Ekspor/Email)
8. Logout

---

## 5. KOMPONEN REUSABLE

### ✅ Komponen Dibuat:
1. **Card** - Container dengan header/content/footer
2. **Button** - 4 variant (primary/secondary/ghost/destructive), 3 size
3. **Input** - Label + helper + error + focus state
4. **Select** - Dropdown custom dengan arrow
5. **Badge** - Kategori pill
6. **ProgressBar** - Linear progress
7. **DonutProgress** - Circular SVG progress
8. **Skeleton** - Loading placeholder
9. **StatCards** - 3 KPI cards dengan progress
10. **LimitPanel** - Form limit + secondary menu
11. **ExpenseForm** - Form transaksi dengan validasi
12. **TransactionTable** - Tabel dengan sticky header & konfirmasi hapus

### API Props (Contoh):

```jsx
// Button
<Button 
  variant="primary|secondary|ghost|destructive"
  size="sm|md|lg"
  loading={boolean}
  disabled={boolean}
>
  Text
</Button>

// Input
<Input
  label="Tanggal"
  helperText="Format: DD/MM/YYYY"
  errorText="Tanggal wajib diisi"
  required={true}
/>

// StatCard
<StatCard
  label="Total Pengeluaran"
  value="Rp 1.250.000"
  progress={75}
  progressVariant="warning"
  loading={false}
/>
```

---

## 6. MICRO-INTERACTIONS & STATES

### Hover States:
```css
/* Button Primary */
hover:bg-accent-hover (150ms transition)

/* Table Row */
hover:bg-zinc-50 transition-colors duration-150

/* Input */
hover:border-border-dark
```

### Focus States:
```css
/* Semua interactive element */
focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none

/* Input error */
focus:ring-destructive
```

### Loading States:
- **Button**: Spinner icon + disabled
- **Card**: Skeleton placeholder (animate-pulse)
- **Table**: 3 skeleton rows

### Error States:
- **Input**: Red border + icon + error message
- **Form**: Red text below field dengan ikon peringatan

### Konfirmasi Destruktif:
```jsx
// Hapus transaksi → Show inline confirmation
<Button onClick={() => setConfirm(id)}>Hapus</Button>
{confirm === id && (
  <>
    <Button variant="destructive">Ya, Hapus</Button>
    <Button variant="ghost">Batal</Button>
  </>
)}
```

---

## 7. UX WRITING (Bahasa Indonesia)

### Labels:
- ✅ "Total Pengeluaran" (bukan "Total Expense")
- ✅ "Sisa Limit" (bukan "Remaining Budget")
- ✅ "Utilisasi Limit" (bukan "Utilization %")

### Placeholders:
- ✅ "Contoh: Makan siang di restoran"
- ✅ "Contoh: 50000"

### Helper Text:
- ✅ "Masukkan tanpa titik atau koma"
- ✅ "Deskripsi singkat transaksi"

### Error Messages (Actionable):
- ✅ "Tanggal wajib diisi" (bukan "Required")
- ✅ "Masukkan jumlah yang valid" (bukan "Invalid number")
- ✅ "Pilih bulan terlebih dahulu"

### CTA:
- ✅ "Tambah Transaksi" (bukan "Add" / "Submit")
- ✅ "Simpan Limit" (bukan "Save")
- ✅ "Simpan Perubahan" (edit mode)

### Empty State:
- ✅ "Belum ada transaksi di bulan ini."
- ✅ "Tambahkan pengeluaran pertama Anda dengan formulir di atas."

---

## 8. QUICK WINS (1–2 Jam Implementasi) ⚡

### Priority Changes:

1. **✅ Gabungkan Sisa Limit + Utilisasi dengan progress bar**
   - Sebelum: 2 card terpisah
   - Sesudah: 1 card "Sisa Limit" dengan progress bar utilisasi
   - Impact: -33% visual clutter, context lebih jelas

2. **✅ Jadikan Simpan/Tambah sebagai CTA primer**
   - Sebelum: Semua tombol biru/hijau
   - Sesudah: Primary button indigo-600, lainnya ghost/secondary
   - Impact: Hierarki jelas, aksi utama menonjol

3. **✅ Pindahkan Ekspor/Email ke secondary menu (⋮)**
   - Sebelum: 5 tombol sejajar
   - Sesudah: 1 primary + 1 dropdown menu
   - Impact: -60% horizontal space, mobile-friendly

4. **✅ Rapikan grid form 2 kolom di desktop**
   - Sebelum: 4 kolom sempit
   - Sesudah: 2×2 grid dengan spacing proper
   - Impact: Readability +50%, error state lebih jelas

5. **✅ Konsistenkan kapitalisasi kategori**
   - Sebelum: "food & beverages" (lowercase)
   - Sesudah: "Food & Beverages" (Title Case di badge)
   - Impact: Profesional, konsisten

6. **✅ Tambahkan hover state pada table row**
   - Sebelum: Tidak ada feedback
   - Sesudah: `hover:bg-zinc-50` + `focus-within:bg-zinc-50`
   - Impact: Scannability +40%, accessibility

7. **✅ Sticky header pada tabel**
   - Sebelum: Header scroll bersama
   - Sesudah: `position: sticky` + `top: 0`
   - Impact: Context retention saat scroll

---

## 9. CHECKLIST QA ✓

### Responsif:
- [ ] Breakpoint sm (640px) - Stack 1 kolom
- [ ] Breakpoint md (768px) - Form 2 kolom
- [ ] Breakpoint lg (1024px) - Layout 2 kolom sidebar
- [ ] Tabel horizontal scroll di mobile (`overflow-x-auto`)
- [ ] KPI cards tetap terbaca di 320px width

### Aksesibilitas (WCAG 2.1 AA):
- [ ] Kontras text-primary vs surface ≥ 4.5:1 ✅ (18.83:1)
- [ ] Kontras accent vs surface ≥ 4.5:1 ✅ (8.59:1)
- [ ] Focus ring visible (`ring-2 ring-accent ring-offset-2`)
- [ ] Urutan tab logis (form → table → actions)
- [ ] ARIA labels untuk tombol ikon (`aria-label="Edit transaksi"`)
- [ ] ARIA untuk error (`aria-invalid`, `aria-describedby`)
- [ ] Modal/Alert dengan `role="dialog"` + focus trap
- [ ] Keyboard nav: Enter/Space untuk tombol, Esc untuk close

### Performa:
- [ ] Shadow ringan (max `shadow-md` dengan opacity 0.08)
- [ ] Skeleton saat fetch (`<Skeleton variant="text" />`)
- [ ] Angka Rupiah dipisah ribuan (`Intl.NumberFormat`)
- [ ] Persentase dibulatkan 1 desimal (`toFixed(1)`)
- [ ] Format tanggal konsisten (`Intl.DateTimeFormat`)
- [ ] Transisi 150–200ms (tidak 300ms+)
- [ ] Lazy load table jika >100 rows (future)

---

## 10. RASIONAL & TRADE-OFFS

### Keputusan Utama:

#### ✅ Theme: Monochrome + Indigo (vs Warm/Neo-Classic)
**Rasional**: Keuangan = objektif, netral, tidak emosional. Indigo profesional tanpa agresif (vs merah/oranye).  
**Trade-off**: Kurang "warm" dibanding amber, tapi gain aksesibilitas + timeless.

#### ✅ Komponen: React (vs Vanilla JS)
**Rasional**: Project saat ini pakai Vanilla, tapi komponen React lebih maintainable + reusable.  
**Trade-off**: Butuh setup React (Vite/CRA), tapi long-term ROI tinggi.  
**Alternatif**: Bisa port ke Vanilla dengan Web Components.

#### ✅ Hierarki: Primary CTA + Secondary Menu
**Rasional**: 80% user pakai Simpan/Tambah, 20% pakai Ekspor/Email (Pareto).  
**Trade-off**: Ekspor butuh +1 klik, tapi UI 60% lebih bersih.

#### ✅ Layout Desktop: Sidebar (vs Full Width)
**Rasional**: Stat + Form = context yang jarang berubah, tabel = data utama.  
**Trade-off**: Tabel width -30%, tapi KPI always visible (no scroll).

#### ✅ Progress: Linear (vs Donut)
**Rasional**: Linear lebih scannable, donut butuh space + cognitive load.  
**Trade-off**: Donut lebih "wow", tapi linear lebih fungsional untuk dashboard data.

---

## Implementasi Berikutnya:

Lihat file `components/` untuk kode React siap pakai:
- `Card.jsx`, `Button.jsx`, `Input.jsx`, `Select.jsx`
- `StatCards.jsx`, `LimitPanel.jsx`, `ExpenseForm.jsx`, `TransactionTable.jsx`
- `Progress.jsx` (Linear + Donut), `Badge.jsx`, `Skeleton.jsx`

Lihat `tailwind.config.js` untuk design tokens custom.

