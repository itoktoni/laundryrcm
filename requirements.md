# Laundry AI Software — Requirements Document

## Overview

Software manajemen laundry all-in-one, gratis, mobile-first, untuk owner dan karyawan laundry 1 outlet. Menggantikan tools berbayar (Qontac Mekari, Cekat AI, Binatu, dll) dengan satu aplikasi terpadu.

**Tagline:** Naikkan Omset Laundry dengan AI — Solusi praktis untuk membuat laundry lebih rapi, cepat, dan menguntungkan.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | SvelteKit + Svelte + JavaScript |
| Styling | Tailwind CSS (mobile-first, dark mode) |
| Database | Turso (SQLite, 9GB free) |
| Auth | Lucia Auth |
| Hosting | Vercel (free) |
| Export PDF | jsPDF |
| Export Excel | SheetJS (xlsx) |
| Charts | Chart.js |
| PWA | Service Worker + Web App Manifest |
| Offline | IndexedDB + Background Sync |

**Biaya: Rp 0/bulan**

---

## Target User

| Role | Akses |
|---|---|
| **Owner** | Semua module, dashboard, laporan, pengaturan, promo, kalkulator |
| **Karyawan** | Order (buat, update status), pelanggan (lihat), task harian |

---

## Database Schema

### 1. users
```
user_id         PK, UUID
user_name       VARCHAR(100)
user_email      VARCHAR(100), UNIQUE
user_password   VARCHAR(255), hashed
user_role       ENUM('owner', 'karyawan')
user_created_at DATETIME, DEFAULT NOW
```

### 2. customers
```
customer_id           PK, UUID
customer_name         VARCHAR(100)
customer_phone        VARCHAR(20)
customer_address      TEXT
customer_vip          BOOLEAN, DEFAULT FALSE
customer_total_orders INT, DEFAULT 0
customer_created_at   DATETIME, DEFAULT NOW
```

### 3. item_types
```
item_type_id         PK, UUID
item_type_name       VARCHAR(50)  -- baju, sprei, jas, celana, handuk, dll
item_type_created_at DATETIME, DEFAULT NOW
```

### 4. services
```
service_id          PK, UUID
service_name        VARCHAR(50)  -- cuci, setrika, cuci+setrika, express, dry clean
service_description TEXT
service_created_at  DATETIME, DEFAULT NOW
```

### 5. pricing
```
pricing_id           PK, UUID
item_type_id         FK → item_types
service_id           FK → services
pricing_price_per_kg DECIMAL(10,2)
pricing_created_at   DATETIME, DEFAULT NOW
UNIQUE(item_type_id, service_id)
```

### 6. promotions
```
promo_id          PK, UUID
promo_name        VARCHAR(100)
promo_type        ENUM('percent', 'nominal', 'package')
promo_value       DECIMAL(10,2)  -- persen atau nominal
promo_min_order   DECIMAL(10,2), nullable
promo_code        VARCHAR(50), nullable, UNIQUE
promo_start_date  DATE
promo_end_date    DATE
promo_is_active   BOOLEAN, DEFAULT TRUE
promo_created_at  DATETIME, DEFAULT NOW
```

### 7. orders
```
order_id                    PK, UUID
customer_id                 FK → customers
promo_id                    FK → promotions, nullable
order_subtotal              DECIMAL(10,2)  -- sebelum diskon
order_discount_amount       DECIMAL(10,2), DEFAULT 0
order_total_price           DECIMAL(10,2)  -- setelah diskon
order_status                ENUM('pending', 'cuci', 'kering', 'setrika', 'selesai', 'diambil')
order_payment_status        ENUM('unpaid', 'paid')
order_notes                 TEXT, nullable
order_created_by            FK → users
order_created_at            DATETIME, DEFAULT NOW
```

### 8. order_items
```
item_id            PK, UUID
order_id           FK → orders
item_type_id       FK → item_types
service_id         FK → services
item_weight_kg     DECIMAL(5,2)
item_price_per_kg  DECIMAL(10,2)
item_subtotal      DECIMAL(10,2)  -- weight × price_per_kg
item_created_at    DATETIME, DEFAULT NOW
```

### 9. transactions
```
transaction_id          PK, UUID
order_id                FK → orders, nullable
transaction_type        ENUM('income', 'expense')
transaction_amount      DECIMAL(10,2)
transaction_category    VARCHAR(50)  -- pembayaran order, gaji, chemical, listrik, sewa, dll
transaction_description TEXT, nullable
transaction_date        DATE
transaction_created_at  DATETIME, DEFAULT NOW
```

### 10. inventory
```
inventory_id             PK, UUID
inventory_name           VARCHAR(100)
inventory_quantity       DECIMAL(10,2)
inventory_unit           VARCHAR(20)  -- liter, kg, pcs
inventory_min_stock      DECIMAL(10,2)
inventory_last_restocked DATE
inventory_created_at     DATETIME, DEFAULT NOW
```

### 11. machines
```
machine_id           PK, UUID
machine_name         VARCHAR(100)
machine_type         VARCHAR(50)  -- cuci, pengering, setrika, dll
machine_status       ENUM('active', 'broken', 'maintenance')
machine_last_service DATE
machine_next_service DATE
machine_created_at   DATETIME, DEFAULT NOW
```

---

## Modules & Fitur

### Module 1: Auth & User Management

| Fitur | Owner | Karyawan |
|---|---|---|
| Login | ✅ | ✅ |
| Register | ✅ | ❌ (owner yang tambah) |
| Kelola user | ✅ | ❌ |
| Ganti password | ✅ | ✅ |

**Flow:**
- Login → redirect ke dashboard (owner) atau order list (karyawan)
- Session pakai Lucia Auth + cookie
- Role-based middleware di setiap route

---

### Module 2: Dashboard (Owner Only)

**Kartu Ringkasan:**
- Omset hari ini / minggu ini / bulan ini
- Order aktif (dalam proses)
- Laba bersih bulan ini
- Pelanggan baru bulan ini

**Chart:**
- Grafik omset harian (bar chart, 7 hari terakhir)
- Grafik laba bulanan (line chart, 6 bulan terakhir)

**Quick Actions:**
- + Order Baru
- Lihat Order Aktif
- Catat Pengeluaran

**Notifikasi:**
- Stok hampir habis
- Mesin perlu servis
- Order belum dibayar > 3 hari

---

### Module 3: Order Management

**Buat Order Baru:**
1. Pilih pelanggan (search by nama/phone) atau buat baru
2. Tambah item:
   - Pilih jenis item (baju, sprei, jas, dll)
   - Pilih servis (cuci, setrika, cuci+setrika, express)
   - Input berat (kg)
   - Harga otomatis dari tabel pricing
   - Subtotal = berat × harga/kg
3. Tambah item lagi (opsional)
4. Pilih promo/voucher (opsional)
   - Input voucher code → validasi
   - Atau pilih promo aktif
   - Diskon otomatis diterapkan
5. Hitung total: subtotal - diskon
6. Simpan order

**Daftar Order:**
- Tampilan card (mobile) / table (desktop)
- Filter: status, tanggal, pelanggan, payment status
- Search: order ID, nama pelanggan
- Sort: terbaru, terlama, harga

**Detail Order:**
- Info pelanggan
- Daftar item dengan harga
- Promo/diskon diterapkan
- Status timeline (pending → cuci → kering → setrika → selesai → diambil)
- Tombol update status (karyawan bisa)
- Tombol catat pembayaran (owner/karyawan)
- Cetak nota / invoice (PDF)

**Status Flow:**
```
pending → cuci → kering → setrika → selesai → diambil
                                           ↗
                              (cancel) ────
```

---

### Module 4: Pelanggan (CRM)

**Daftar Pelanggan:**
- Card view (mobile) / table (desktop)
- Search: nama, phone
- Filter: VIP, baru, sering order
- Urutkan: total order, terbaru

**Detail Pelanggan:**
- Profil (nama, phone, alamat)
- Status VIP
- Total order & total belanja
- Riwayat order (list)
- Grafik order bulanan

**Aksi:**
- Edit profil
- Tandai VIP
- Export ke CSV
- Kirim promo (placeholder untuk WA integration)

---

### Module 5: Keuangan

**Pemasukan:**
- Otomatis dari order yang status `paid`
- Bisa input manual (pemasukan lain)

**Pengeluaran:**
- Input manual dengan kategori:
  - Gaji karyawan
  - Chemical (deterjen, softener, pewangi)
  - Listrik
  - Air
  - Sewa tempat
  - Perawatan mesin
  - Lainnya

**Laporan:**
- Laba bersih = total pemasukan - total pengeluaran
- Filter by: hari ini, minggu ini, bulan ini, custom range
- Breakdown per kategori

**Export:**
- Laporan keuangan → Excel/CSV
- Laporan keuangan → PDF

---

### Module 6: Inventory

**Daftar Stok:**
- Nama item, jumlah, unit, min stock
- Badge merah jika < min stock
- Riwayat restock

**Aksi:**
- Tambah item baru
- Update stok (masuk/keluar)
- Catat pembelian
- Alert stok rendah (notifikasi di dashboard)

---

### Module 7: Asset & Mesin

**Daftar Mesin:**
- Nama, tipe, status (aktif/rusak/maintenance)
- Jadwal servis berikutnya
- Badge warning jika servis sudah dekat

**Aksi:**
- Tambah mesin
- Update status
- Catat servis
- Export record (PDF)

---

### Module 8: Promo & Diskon

**Buat Promo:**
- Tipe: persen, nominal, paket
- Nilai diskon
- Minimum order (opsional)
- Kode voucher (opsional)
- Masa berlaku (start - end date)
- Status aktif/nonaktif

**Auto Rules:**
- Pelanggan VIP → auto diskon X%
- Order > Rp X → diskon otomatis

**Daftar Promo:**
- Semua promo aktif & nonaktif
- Edit / hapus / nonaktifkan

---

### Module 9: Kalkulator & Tools

**Kalkulator Harga Jual:**
- Input: biaya operasional bulanan (listrik, air, chemical, sewa, gaji)
- Input: target volume (kg/bulan)
- Output: harga jual minimum per kg + margin

**Kalkulator Target Omset:**
- Input: target omset bulanan
- Input: rata-rata harga per kg
- Output: target kg/hari, order/hari

**Kalkulator SDM Ideal:**
- Input: volume cucian (kg/hari)
- Input: kapasitas per karyawan (kg/hari)
- Output: jumlah karyawan ideal

**Kalkulator Profit:**
- Input: omset, semua biaya
- Output: laba bersih, margin %, BEP, ROI

---

### Module 10: Download & Export

**Template SOP (PDF):**
- SOP Penerimaan Order
- SOP Pencucian
- SOP Penyetrikaan
- SOP Packing & Quality Check
- SOP Pengiriman
- SOP Penanganan Komplain

**Invoice/Nota (PDF):**
- Dari detail order
- Logo laundry (placeholder)
- Detail item, harga, diskon, total
- Info pelanggan

**Laporan Export:**
- Laporan order → Excel/CSV
- Laporan keuangan → Excel/CSV
- Laporan pelanggan → Excel/CSV
- Record mesin → PDF

---

### Module 11: PWA & Offline

**PWA:**
- Web App Manifest (icon, name, theme color)
- Install prompt ke home screen
- Splash screen

**Offline:**
- Service Worker caching (app shell + API responses)
- IndexedDB untuk data offline
- Background sync saat online kembali
- Badge "offline" di header

**Dark Mode:**
- Toggle di header/sidebar
- Persist ke localStorage
- System preference detection
- Tailwind `dark:` class

---

## UI/UX Requirements

### Mobile-First Layout

**Mobile (< 768px):**
```
┌─────────────────────┐
│  LaundryKu    [≡]   │  ← Header compact, hamburger menu
├─────────────────────┤
│                     │
│   [Konten Utama]    │  ← Scroll vertikal
│   Card-based        │
│   Tap-friendly      │
│   Button besar      │
│                     │
├─────────────────────┤
│ 🏠  📋  ➕  💰  👤  │  ← Bottom navigation
│Home Order Baru $ Prof│
└─────────────────────┘
```

**Desktop (≥ 768px):**
```
┌────────┬────────────────────────────────────┐
│        │  Navbar          [🌙] [👤] [🔔]   │
│ Sidebar│────────────────────────────────────│
│        │                                    │
│ 🏠 Home│   [Konten Utama]                   │
│ 📋 Order│                                  │
│ 👥 Pel. │   Grid layout                     │
│ 💰 Fin.│   Card-based                      │
│ 📦 Inv.│                                    │
│ 🔧 Asset│                                  │
│ 🎁 Promo│                                  │
│ 🧮 Tools│                                  │
│ 📊 Report│                                 │
│ ⚙️ Set.│                                    │
│        │                                    │
└────────┴────────────────────────────────────┘
```

### Design System

**Colors:**
- Primary: Blue-600 (#2563EB)
- Success: Green-500 (#22C55E)
- Warning: Yellow-500 (#EAB308)
- Danger: Red-500 (#EF4444)
- Dark BG: Gray-900 (#111827)
- Dark Card: Gray-800 (#1F2937)

**Typography:**
- Font: Inter (system font stack)
- Heading: font-bold
- Body: font-normal

**Components:**
- Button (primary, secondary, danger, ghost)
- Input, Select, Textarea
- Card, Badge, Modal
- Table (responsive)
- Status Badge (color-coded)
- Toast notification
- Loading spinner

---

## Page List

| Route | Page | Role |
|---|---|---|
| `/` | Landing / redirect | Public |
| `/login` | Login page | Public |
| `/register` | Register page | Public |
| `/dashboard` | Dashboard owner | Owner |
| `/orders` | Daftar order | Owner, Karyawan |
| `/orders/new` | Buat order baru | Owner, Karyawan |
| `/orders/[id]` | Detail order | Owner, Karyawan |
| `/customers` | Daftar pelanggan | Owner, Karyawan |
| `/customers/[id]` | Detail pelanggan | Owner, Karyawan |
| `/finance` | Keuangan | Owner |
| `/inventory` | Stok inventory | Owner |
| `/machines` | Mesin & aset | Owner |
| `/promo` | Promo & diskon | Owner |
| `/tools/calculator` | Kalkulator | Owner |
| `/tools/sop` | Template SOP | Owner, Karyawan |
| `/reports` | Laporan & export | Owner |
| `/settings` | Pengaturan | Owner |

**Total: 17 halaman**

---

## Non-Functional Requirements

| Aspek | Requirement |
|---|---|
| Performance | Load time < 2 detik di mobile 4G |
| Offline | Bisa lihat data terakhir tanpa internet |
| Security | Password hashed (bcrypt), session cookie httpOnly |
| Responsive | Breakpoint: sm(640), md(768), lg(1024) |
| Accessibility | Touch target min 44px, contrast ratio ≥ 4.5:1 |
| Browser | Chrome, Safari, Firefox (mobile & desktop) |
| Data | Auto-backup via Turso built-in replication |

---

## Milestones

### Fase 1 (Hari 1-2): Core Operasional
- [x] Project setup
- [ ] Auth + role
- [ ] Layout (sidebar + bottom nav)
- [ ] Dashboard
- [ ] CRUD Pelanggan
- [ ] CRUD Order + multi-item
- [ ] Status tracking

### Fase 2 (Hari 3-4): Keuangan & Inventory
- [ ] Module keuangan
- [ ] Export laporan
- [ ] Invoice PDF
- [ ] Module inventory

### Fase 3 (Hari 5-6): Tools & Promo
- [ ] 4 Kalkulator
- [ ] Template SOP
- [ ] Module promo & diskon

### Fase 4 (Hari 7): Polish & Deploy
- [ ] Dark mode
- [ ] PWA + offline
- [ ] Asset & mesin
- [ ] Testing
- [ ] Deploy Vercel

---

## Competitor Comparison

| Fitur | LaundryKu (Ini) | Qontac Mekari | Binatu | Cekat AI |
|---|---|---|---|---|
| Harga | **Gratis** | 1.5jt/bln | 50-100rb/bln | 249rb/bln |
| Order management | ✅ | ✅ | ✅ | ❌ |
| CRM | ✅ | ✅ | ❌ | ❌ |
| Keuangan | ✅ | ✅ | ❌ | ❌ |
| Kalkulator tools | ✅ | ❌ | ❌ | ❌ |
| Export PDF/Excel | ✅ | ✅ | ❌ | ❌ |
| PWA/Offline | ✅ | ❌ | ❌ | ❌ |
| WhatsApp integration | Nanti | ✅ | ❌ | ✅ |
| SOP templates | ✅ | ❌ | ❌ | ❌ |
| Dark mode | ✅ | ❌ | ❌ | ❌ |

---

*Last updated: 2026-07-17*
