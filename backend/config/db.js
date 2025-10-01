// Mengimpor library mysql2
const mysql = require('mysql2');

// Membuat connection pool ke database
// Pool lebih efisien daripada koneksi tunggal karena mengelola beberapa koneksi sekaligus
const pool = mysql.createPool({
  host: process.env.DB_HOST,       // Diambil dari file .env
  user: process.env.DB_USER,       // Diambil dari file .env
  password: process.env.DB_PASSWORD, // Diambil dari file .env
  database: process.env.DB_NAME,   // Diambil dari file .env
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Menggunakan .promise() agar kita bisa memakai async/await
const promisePool = pool.promise();

// Mengekspor pool agar bisa digunakan di file lain
module.exports = promisePool;