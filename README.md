# 🚀 Aplikasi Manajemen Event (Proyek Skripsi)

Aplikasi web full-stack untuk manajemen event yang dibangun sebagai proyek skripsi. Platform ini memungkinkan pengguna untuk mendaftar, login, membuat, dan mengelola event mereka sendiri. Untuk meningkatkan keterlibatan pengguna, aplikasi ini juga dilengkapi dengan sistem gamifikasi berupa poin dan referral.

*(Tambahkan screenshot aplikasi Anda di sini nanti)*
![App Screenshot](path/to/your/screenshot.png)

---

## ✨ Fitur Utama

-   **Otentikasi Pengguna**: Sistem registrasi dan login yang aman menggunakan JSON Web Tokens (JWT).
-   **Manajemen Event (CRUD)**: Pengguna yang sudah login dapat melakukan Create, Read, Update, dan Delete untuk event yang mereka buat.
-   **Verifikasi Kepemilikan**: Pengguna hanya dapat mengedit atau menghapus event yang mereka miliki.
-   **Sistem Poin**: Pengguna mendapatkan poin setiap kali berhasil mendaftar ke sebuah event.
-   **Sistem Referral Dua Arah**: Pengguna lama (referrer) dan pengguna baru (referee) sama-sama mendapatkan bonus poin saat pendaftaran berhasil dilakukan menggunakan kode referral.

---

## 🔧 Teknologi yang Digunakan

-   **Frontend**:
    -   [React](https://reactjs.org/) (dibuat dengan [Vite](https://vitejs.dev/))
    -   [React Router](https://reactrouter.com/) untuk navigasi
    -   [React Bootstrap](https://react-bootstrap.github.io/) untuk komponen UI
    -   [Axios](https://axios-http.com/) untuk permintaan API

-   **Backend**:
    -   [Node.js](https://nodejs.org/)
    -   [Express.js](https://expressjs.com/) untuk server & routing
    -   [MySQL2](https://github.com/sidorares/node-mysql2) sebagai driver database
    -   [JSON Web Token (JWT)](https://jwt.io/) untuk otentikasi
    -   [bcrypt.js](https://github.com/dcodeIO/bcrypt.js) untuk hashing password
    -   [Dotenv](https://github.com/motdotla/dotenv) untuk manajemen environment variables

-   **Database**:
    -   [MySQL](https://www.mysql.com/)

---

## ⚙️ Panduan Instalasi Lokal

Untuk menjalankan proyek ini di komputer lokal Anda, ikuti langkah-langkah berikut.

### Prasyarat

-   [Node.js](https://nodejs.org/en/download/) (v18 atau lebih baru)
-   [MySQL](https://dev.mysql.com/downloads/mysql/)

### Backend Setup

1.  **Clone repository ini:**
    ```bash
    git clone https://github.com/khristofer1/Skripsi/edit/main/README.md
    ```

2.  **Masuk ke direktori backend:**
    ```bash
    cd backend
    ```

3.  **Install dependensi:**
    ```bash
    npm install
    ```

4.  **Setup Database:**
    -   Buka MySQL client Anda (misal: DBeaver).
    -   Buat database baru (misal: `skripsi_event_app`).
    -   Jalankan query `CREATE TABLE` untuk `users`, `events`, `registrations`, dan `referrals` yang telah Anda buat sebelumnya.

5.  **Konfigurasi Environment Variable:**
    -   Buat file `.env` di dalam folder `backend`.
    -   Salin isi dari `.env.example` (jika ada) atau isi dengan format berikut:
        ```env
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=password_database_anda
        DB_NAME=skripsi_event_app
        JWT_SECRET=kunci_rahasia_unik_anda
        ```

6.  **Jalankan server backend:**
    ```bash
    node index.js
    ```
    Server akan berjalan di `http://localhost:5000`.

### Frontend Setup

1.  **Buka terminal baru, masuk ke direktori frontend:**
    ```bash
    cd frontend
    ```

2.  **Install dependensi:**
    ```bash
    npm install
    ```

3.  **Jalankan server frontend:**
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di `http://localhost:5173` (atau port lain yang tersedia).

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT.
