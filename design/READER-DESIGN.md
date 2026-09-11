# Izanami — Manga Reader UI (Kotatsu-style)

File: `reader.html`
Dir: `C:\Users\septi\izanami-web\`

## Konsep
Tiru Kotatsu (Android manga reader open-source) — clean Material You, AMOLED black, minimal chrome, gesture-first.

## Komponen UI (Kotatsu reference)
- **Info bar** top: chapter badge + judul + page indicator + progress % + jam + baterai
- **Chapter header** overlay: judul chapter mengambang dengan backdrop blur
- **Reader surface**: scroll vertikal, scroll-snap per halaman, AMOLED `#000` pure
- **Tap zones**: kiri (prev), kanan (next), tengah (toggle UI) — seperti Kotatsu grid tap
- **Bottom toolbar**: prev / toggle UI / next / zoom / bookmark / details (ReaderActionsView)
- **Zoom indicator**: angka % di pojok kanan atas
- **Toast**: notifikasi sementara "Halaman X", "Bookmark", dll (ToastView)

## Interaksi (JS lengkap — 9 fungsi)
- `prevPage()` / `nextPage()` — navigasi halaman via tombol & keyboard (Arrow keys, Space, Page Down/Up)
- `toggleUI()` — sembunyikan/tampilkan info bar + bottom toolbar + header (tombol ◉ atau tap tengah)
- `scrollToPage()` — scroll halus ke halaman berdasarkan `currentPage`
- `updateUI()` — update indikator halaman dan progress %
- `zoomIn()` — zoom gambar manga (max 2.5x) dengan transform scale
- `bookmarkPage()` — toggle bookmark (indikator ★ aktif sementara)
- `goDetails()` — buka detail chapter
- `showToast()` — notifikasi sementara (fade)
- Scroll detection: mendeteksi halaman aktif berdasarkan posisi scroll
- Double tap: zoom toggle (gestur Kotatsu)
- Keyboard: ArrowRight/Down/Space = next, ArrowLeft/Up = prev, F = toggle UI

## Visual
- Background: AMOLED black `#050505` / `#000`
- Font: Inter + DM Sans
- Card/toolbar buttons: `rgba(255,255,255,.05)` bg + `rgba(255,255,255,.08)` border, radius 10px
- Accent: violet (`#7c3aed`) untuk badge/aktiv dan cyan (`#06b6d4`) progress
- Image: `filter: brightness(.96) contrast(1.08)` — seperti reader gelap Kotatsu
