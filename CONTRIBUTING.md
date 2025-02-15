# Contributing to Sija-Antigedor
Terima kasih sudah tertarik untuk berkontribusi pada **Sija-Antigedor**!. Berikut adalah panduan untuk mempermudah proses kontribusi.

## Rekomendasi sebelum berkontribusi:
- Sangat direkomendasikan menggunakan dokumentasi NEXT.js dan React sebagai referensi 
- Mau belajar TypeScript (opsional)

## Struktur Branch
- `main` - Branch production yang sudah dideploy di Vercel
- `dev` - Branch development untuk menampung fitur-fitur baru
- `contri/*` - Branch untuk pengembangan fitur baru

## Standar Format Commit Message
Gunakan prefix berikut untuk commit message:
- `feat:` - Menambahkan fitur baru
- `fix:` - Memperbaiki bug
- `hotfix:` - Perbaikan darurat untuk environtment production
- `style:` - Perubahan formatting, missing semicolon, dll
- `refactor:` - Refactoring kode
- `test:` - Menambah atau memperbaiki test
- `chore:` - Update dependencies, konfigurasi, dll

Contoh:
```
feat: menambahkan fitur dark mode
fix: memperbaiki layout mobile
hotfix: memperbaiki critical security issue
```

## Cara Berkontribusi
1. **Fork Repository Ini**
   - Klik tombol "Fork" di pojok kanan atas halaman repo ini
   - Ini akan membuat repository sijaantigedor di akun kalian

2. **Clone Repository yang Sudah di Fork**
   ```bash
   # Clone repository
   git clone https://github.com/username-anda/sijaantigedor.git
   cd sijaantigedor

   # Set up remote upstream
   git remote add upstream https://github.com/dhaniil/sijaantigedor.git

   # Checkout ke branch dev
   git checkout dev

   # Install dependencies
   npm install

   # Copy environment variables
   cp .env.example .env.local

   # Run development server
   npm run dev
   ```

3. **Buat Branch Baru dari Branch Dev**
   ```bash
   # Pastikan kamu berada di branch dev dan sudah updated
   git checkout dev
   git pull upstream dev

   # Buat branch baru untuk fitur
   git checkout -b 
   contoh: git checkout -b contri/dark-mode
   ```

4. **Lakukan Perubahan dan Commit**
   ```bash
   git add .
   git commit -m "feat: menambahkan fitur X"
   ```

5. **Push Perubahan ke GitHub**
   ```bash
   git push origin contri/nama-fitur
   ```

6. **Buat Pull Request**
   - Buka repository ini di GitHub
   - Buat Pull Request dari branch `contri/nama-fitur` ke branch `dev`
   - Pull Request akan direview oleh Laztech dan Aryok

## Setelah Pull Request di-Merge oleh Maintainer

1. **Update Local Repository**
   ```bash
   # Pindah ke branch dev
   git checkout dev

   # Sync fork dengan upstream
   git fetch upstream
   git merge upstream/dev

   # Update dependencies
   npm install
   ```

2. **Bersihkan Branch yang Sudah di-Merge (Rekomen)**
   ```bash
   # Hapus branch fitur yang sudah di-merge
   git branch -d contri/nama-fitur
   ```

3. **Memulai Kontribusi Baru**
   ```bash
   # Pastikan branch dev sudah updated
   git checkout dev
   git pull upstream dev

   # Buat branch baru untuk fitur selanjutnya
   git checkout -b feature/fitur-baru
   ```

## Pedoman Kode
- Gunakan format kode yang konsisten
- Pastikan tidak ada error atau warning sebelum commit
- Jika menambahkan fitur baru, sertakan dokumentasi yang jelas bagaimana fitur baru itu
- Pastikan fitur berjalan dengan baik di environment development sebelum membuat Pull Request

## Pelaporan Bug
Jika menemukan bug, silakan buat Issue dengan format berikut:
1. Deskripsi singkat tentang bug dan dampaknya
2. Langkah-langkah untuk mereproduksi bug
3. Disarankan menyertakan Screenshot atau log error
4. Sebutkan di branch mana bug ditemukan (dev/main)

Terima kasih atas kontribusi kalian!
