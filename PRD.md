# Product Requirements Document (PRD)

**Nama Proyek:** SimulaSIM (Web Kuis Simulasi Ujian SIM)
**Versi:** 1.1.0
**Target Tech Stack:** React.js (Vite), Tailwind CSS, Supabase (PostgreSQL & Auth)

---

## 1. Product Overview

### 1.1 Visi Produk
Membangun platform simulasi ujian teori Surat Izin Mengemudi (SIM) yang interaktif dan ringan. Sistem ini dirancang dengan antarmuka yang sangat bersih (*clean*) dan mendukung pemutaran aset media (video/gambar) secara dinamis, dilengkapi dengan sistem umpan balik instan (*live feedback*) untuk pengalaman belajar yang maksimal.

### 1.2 Target Pengguna
1.  **Peserta Ujian (End-User):** Calon pengemudi yang membutuhkan platform latihan cepat tanpa hambatan registrasi yang rumit.
2.  **Administrator (Content Manager):** Pengelola sistem yang bertugas memperbarui bank soal dan aset media ujian melalui *dashboard* khusus.

---

## 2. System Architecture

Sistem mengadopsi arsitektur **Dual-Portal** terpisah untuk memastikan keamanan data dan pemisahan logika aplikasi (*Separation of Concerns*).



1.  **Client Portal (User-Facing):** Aplikasi publik untuk pengerjaan kuis dengan antarmuka yang dioptimalkan untuk performa tinggi.
2.  **Admin CMS (Back-office):** Portal terproteksi untuk operasi CRUD (Create, Read, Update, Delete) bank soal.

---

## 3. User & Admin Flow

### 3.1 Alur Pengguna (Client Portal)
1.  **Landing Page:** Menampilkan pengantar singkat dan akses masuk.
2.  **Lightweight Identity:** Input **Nama** dan **Email** sebagai identitas sesi (disimpan via `localStorage` dan di-sinkronisasi ke *database*) tanpa menggunakan *password*.
3.  **Interactive Quiz Session (Live Feedback):**
    * Sistem merender soal dan media (video/gambar) secara berurutan.
    * **Validasi Instan:** Saat pengguna memilih opsi, sistem langsung mengunci jawaban dan memberikan indikator visual (Hijau untuk benar, Merah untuk salah).
    * Tombol navigasi "Selanjutnya" hanya muncul setelah pengguna memberikan jawaban.
4.  **Result Summary:** Halaman akhir yang merangkum skor total, jumlah jawaban benar/salah, dan persentase kelulusan.

### 3.2 Alur Administrator (CMS Portal)
1.  **Secure Login:** Autentikasi ketat menggunakan Email & Password bawaan Supabase Auth.
2.  **Dashboard Utama:** DataGrid yang menampilkan daftar seluruh soal aktif di dalam sistem.
3.  **Question Builder (Form Input):**
    * Input *Hotlink* URL Media untuk efisiensi penyimpanan *server*.
    * *Dropdown* seleksi tipe media (`video` atau `image`).
    * Form teks pertanyaan.
    * Input dinamis untuk opsi pilihan ganda dan penentuan kunci jawaban utama.

---

## 4. Functional Requirements

### 4.1 Modul Klien (User)
| Fitur | Prioritas | Deskripsi Teknis |
| :--- | :--- | :--- |
| **Session Persistence** | P0 | Menyimpan sesi *user* di `localStorage` untuk mencegah kehilangan progres akibat *refresh* peramban. |
| **Dynamic Media Engine** | P0 | *Conditional rendering* yang mengeksekusi *tag* `<video>` untuk tipe `.mp4` dan *tag* `<img>` untuk tipe gambar berdasarkan kolom `media_type`. |
| **Live Feedback Engine** | P0 | Logika *state management* yang memvalidasi opsi secara *real-time*, memblokir *input* ganda, dan menyajikan indikator warna instan. |
| **Exam Timer** | P1 | Penghitung waktu mundur yang berjalan secara asinkron dan otomatis mengunci ujian saat limit tercapai. |

### 4.2 Modul Admin (CMS)
| Fitur | Prioritas | Deskripsi Teknis |
| :--- | :--- | :--- |
| **Route Protection** | P0 | Implementasi *Private Route* di React yang memvalidasi token sesi Supabase sebelum merender *dashboard*. |
| **Question CRUD** | P0 | Kemampuan penuh untuk mengelola baris data di tabel `questions`. |
| **Media URL Handling** | P1 | Mendukung integrasi *Hotlinking* aset dari sumber eksternal untuk menekan penggunaan *storage bandwidth*. |

---

## 5. Database Schema (Supabase PostgreSQL)



### 5.1 Tabel `users`
Menampung data profil *lightweight* peserta.
* `id` (uuid, Primary Key)
* `name` (text)
* `email` (text, unique)
* `created_at` (timestamp with time zone)

### 5.2 Tabel `questions`
Pusat bank soal dan konfigurasi *hotlink* media.
* `id` (int8, Primary Key, Auto-increment)
* `media_url` (text, nullable)
* `media_type` (text, nullable) — *Nilai ekspektasi: 'video' atau 'image'*
* `question_text` (text)
* `options` (jsonb) — *Struktur data: `[{"id": "A", "text": "...", "isCorrect": true}, ...]`*
* `created_at` (timestamp with time zone)

### 5.3 Tabel `test_results`
Mencatat riwayat dan rekapitulasi ujian.
* `id` (uuid, Primary Key)
* `user_email` (text, Foreign Key)
* `score` (int4)
* `total_questions` (int4)
* `completed_at` (timestamp with time zone)

---

## 6. Non-Functional Requirements & Design System

* **UI/UX:** *Clean architecture*, minimalis, *mobile-first responsiveness*, optimalisasi *white space*.
* **Typography:** Keluarga fon *Sans-serif* modern (contoh: Inter, Geist).
* **Color Palette:** Netral dan profesional (Slate-50 untuk *background*, Blue-600 untuk interaksi primer, peringatan warna semantik untuk validasi jawaban).
* **Performance:**
    * Skor *Lighthouse* minimal 90.
    * Penggunaan *Lazy Loading* pada aset media eksternal.
    * Pemanfaatan properti `preload="metadata"` pada *tag* video untuk percepatan *rendering* DOM awal.