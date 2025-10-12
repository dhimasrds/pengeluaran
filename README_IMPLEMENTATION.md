# 🚀 Implementasi Redesign Dashboard

## Setup Project

### 1. Install Dependencies

Jika ingin menggunakan React (recommended untuk long-term):

```bash
npm init -y
npm install react react-dom
npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Konfigurasi Vite (jika pakai React)

Buat `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### 3. Update package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 4. Struktur File

```
pengeluaran/
├── components/
│   ├── Badge.jsx
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Dashboard.jsx
│   ├── ExpenseForm.jsx
│   ├── Input.jsx
│   ├── LimitPanel.jsx
│   ├── Progress.jsx
│   ├── Select.jsx
│   ├── Skeleton.jsx
│   ├── StatCards.jsx
│   ├── TransactionTable.jsx
│   ├── index.jsx (entry point)
│   └── index.css
├── js/ (backend existing)
│   ├── auth-manager.js
│   ├── expense-manager.js
│   ├── firebase-service.js
│   └── ...
├── tailwind.config.js ✅
├── index.html (baru)
├── package.json
└── DESIGN_SYSTEM.md ✅
```

---

## 🎨 Apa yang Sudah Dibuat?

### ✅ Design System Lengkap
File: `DESIGN_SYSTEM.md`

Berisi:
1. **Diagnosis UI/UX** - 6 masalah utama teridentifikasi
2. **Theme Monochrome + Indigo** - Palet 18 warna + state colors
3. **Design Tokens** - Colors, radius, spacing, font, shadow
4. **Layout Blueprint** - Mobile stack + Desktop 2-kolom
5. **Dokumentasi lengkap** UX writing, accessibility, performance

### ✅ Tailwind Config
File: `tailwind.config.js`

Custom tokens:
- `bg-accent` → Indigo 600
- `text-text-primary` → Zinc 900
- `border-border` → Zinc 200
- `shadow-sm/md/lg` → Optimized untuk performa
- Spacing scale 2-32px
- Font scale xs-3xl

### ✅ 12 Komponen React Reusable

| Komponen | Props | Use Case |
|----------|-------|----------|
| `Card` | header, footer | Container |
| `Button` | variant (4), size (3), loading | CTA |
| `Input` | label, error, helper, required | Form field |
| `Select` | options, error | Dropdown |
| `Badge` | variant (5) | Kategori tag |
| `ProgressBar` | value, variant | Linear progress |
| `DonutProgress` | value, size | Circular SVG |
| `Skeleton` | variant | Loading state |
| `StatCards` | KPI data | 3 stat cards |
| `LimitPanel` | onSave, onExport | Limit form |
| `ExpenseForm` | onSubmit, validation | Add/edit transaksi |
| `TransactionTable` | data, onEdit, onDelete | Tabel dengan sticky header |

### ✅ Dashboard Component
File: `components/Dashboard.jsx`

Features:
- ✅ Responsive layout (mobile stack, desktop 2-col)
- ✅ State management (useState)
- ✅ Mock data untuk demo
- ✅ Handlers untuk CRUD operations
- ✅ Loading states
- ✅ Edit mode untuk transaksi

---

## 🔌 Integrasi dengan Backend Existing

### Opsi 1: Keep Vanilla JS (Quick Migration)

Anda bisa tetap pakai `js/firebase-service.js` existing dan wrap dengan React hooks:

Buat `hooks/useFirebase.js`:

```jsx
import { useState, useEffect } from 'react';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../js/expense-manager.js';

export function useExpenses(bulan) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getExpenses(bulan);
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [bulan]);

  const handleAdd = async (expenseData) => {
    await addExpense(expenseData);
    // Re-fetch atau update state
  };

  return { transactions, loading, handleAdd };
}
```

### Opsi 2: Port Komponen ke Vanilla JS

Jika tidak ingin setup React, port komponen ke Web Components:

```js
class StatCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  connectedCallback() {
    const label = this.getAttribute('label');
    const value = this.getAttribute('value');
    
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .card { 
          background: white; 
          border-radius: 12px; 
          padding: 16px; 
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }
      </style>
      <div class="card">
        <p class="label">${label}</p>
        <p class="value">${value}</p>
      </div>
    `;
  }
}

customElements.define('stat-card', StatCard);
```

---

## 🎯 Quick Wins Implementation (Prioritas)

### 1️⃣ Update HTML dengan Tailwind Config (30 menit)

Ganti CDN Tailwind dengan build version untuk pakai custom config:

```bash
npx tailwindcss -i ./components/index.css -o ./style.css --watch
```

### 2️⃣ Apply Design Tokens ke HTML Existing (30 menit)

Update `index.html` existing dengan class baru:

```html
<!-- SEBELUM -->
<button class="bg-blue-600 text-white px-4 py-2 rounded">
  Simpan
</button>

<!-- SESUDAH -->
<button class="bg-accent text-accent-fg px-16 py-8 rounded-lg hover:bg-accent-hover transition-all duration-150 focus:ring-2 focus:ring-accent focus:ring-offset-2">
  Simpan Limit
</button>
```

### 3️⃣ Implement Stat Cards dengan Progress (15 menit)

```html
<div class="grid grid-cols-1 sm:grid-cols-3 gap-16">
  <div class="bg-surface rounded-xl border border-border shadow-sm p-16">
    <p class="text-sm font-medium text-text-secondary mb-8">Sisa Limit</p>
    <p class="text-2xl font-bold text-text-primary mb-8">Rp 3.750.000</p>
    <!-- Progress bar -->
    <div class="w-full bg-zinc-100 rounded-full h-8">
      <div class="h-full bg-success rounded-full transition-all duration-300" style="width: 25%"></div>
    </div>
  </div>
</div>
```

### 4️⃣ Move Secondary Actions ke Menu (20 menit)

```html
<!-- Dropdown menu untuk Ekspor/Email -->
<div class="relative">
  <button class="text-text-secondary hover:bg-zinc-100 px-12 py-6 rounded-lg" onclick="toggleMenu()">
    ⋮ Lainnya
  </button>
  <div id="secondaryMenu" class="hidden absolute mt-6 w-48 bg-white rounded-lg shadow-lg border border-border">
    <button onclick="eksporCSV()">📊 Ekspor ke CSV</button>
    <button onclick="kirimEmail()">✉️ Kirim ke Email</button>
  </div>
</div>
```

### 5️⃣ Add Hover States pada Table (5 menit)

```html
<tr class="hover:bg-zinc-50 transition-colors duration-150 focus-within:bg-zinc-50">
  <!-- table cells -->
</tr>
```

---

## ✅ QA Checklist

Sebelum deploy, cek:

### Responsif
- [ ] Test di Chrome DevTools: 320px, 375px, 768px, 1024px
- [ ] Tabel bisa horizontal scroll di mobile
- [ ] Font size minimal 14px di mobile

### Aksesibilitas
- [ ] Tab order logis (test dengan keyboard only)
- [ ] Focus ring visible di semua interactive element
- [ ] Contrast checker: WebAIM (semua ≥ 4.5:1)
- [ ] Screen reader test: NVDA/JAWS

### Performa
- [ ] LCP < 2.5s (Chrome Lighthouse)
- [ ] Shadow tidak lebih dari `shadow-md`
- [ ] Animasi hanya transition 150-200ms
- [ ] Rupiah format dengan `Intl.NumberFormat`

---

## 📦 Deployment

### Build Production:

```bash
npm run build
```

Output di `dist/` siap upload ke hosting.

### Test Local:

```bash
npm run dev
```

Buka http://localhost:5173

---

## 🆘 Troubleshooting

### Issue: Tailwind custom colors tidak muncul

**Fix**: Pastikan `tailwind.config.js` ada di root dan `content` path benar:

```js
content: [
  "./index.html",
  "./components/**/*.{js,jsx}",
]
```

### Issue: React components tidak render

**Fix**: Pastikan ada `<div id="root"></div>` di HTML dan import `index.jsx` sebagai module:

```html
<script type="module" src="/components/index.jsx"></script>
```

### Issue: Firebase auth masih pakai vanilla

**Fix**: Wrap auth logic dengan React Context:

```jsx
// contexts/AuthContext.jsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // ... auth logic
  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}
```

---

## 📚 Resources

- **Design System**: `DESIGN_SYSTEM.md`
- **Tailwind Docs**: https://tailwindcss.com/docs
- **React Docs**: https://react.dev
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/

---

## 🎉 Next Steps

1. ✅ Review semua komponen di folder `components/`
2. ✅ Test Dashboard component: `components/Dashboard.jsx`
3. ✅ Integrate dengan Firebase existing
4. ✅ Deploy ke production
5. ✅ Collect user feedback

**Estimasi total implementasi**: 4-6 jam (dengan backend integration)

