# Contributing to Sija-Antigedor

Terima kasih sudah tertarik untuk berkontribusi pada **Sija-Antigedor**!. Berikut adalah panduan untuk mempermudah proses kontribusi.

## Rekomendasi sebelum berkontribusi:
- Sangat direkomendasikan menggunakan dokumentasi NEXT.js dan React sebagai referensi 
- Mau belajar TypeScript (opsonal)

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

   # Install dependencies
   npm install

   # Copy environment variables
   cp .env.example .env.local

   # Run development server
   npm run dev
   ```

3. **Buat Branch Baru**
   ```bash
   git checkout -b nama-branch
   contoh: git checkout -b mirekan
   ```

4. **Lakukan Perubahan dan Commit**
   ```bash
   git add .
   git commit -m "feat: menambahkan fitur X"
   ```

5. **Push Perubahan ke GitHub**
   ```bash
   git push origin nama-branch
   ```

6. **Buat Pull Request**
   - Buka repository ini di GitHub
   - Buat Pull Request dari branch yang baru saja kamu push untuk direview Laztech dan Aryok

## Setelah Pull Request di-Merge

1. **Update Local Repository**
   ```bash
   # Pindah ke branch main
   git checkout main

   # Sync fork dengan upstream
   git fetch upstream
   git merge upstream/main

   # Update dependencies
   npm install
   ```

2. **Bersihkan Branch yang Sudah di-Merge (Opsional)**
   ```bash
   # Hapus branch yang sudah di-merge
   git branch -d nama-branch
   ```

3. **Memulai Kontribusi Baru**
   ```bash
   # Pastikan main branch sudah updated
   git checkout main
   git pull upstream main

   # Buat branch baru untuk fitur selanjutnya
   git checkout -b fitur-baru
   ```

## Pedoman Kode
- Gunakan format kode yang konsisten
- Pastikan tidak ada error atau warning sebelum commit
- Jika menambahkan fitur baru, sertakan dokumentasi yang jelas bagaimana fitur baru itu

## Pelaporan Bug
Jika menemukan bug, silakan buat Issue dengan format berikut:
1. Deskripsi singkat tentang bug dan dampaknya
2. Langkah-langkah untuk mereproduksi bug
3. Disarankan menyertakan Screenshot atau log error

Terima kasih atas kontribusi kalian!
