// Memanggil library yang dibutuhkan
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const registrationRoutes = require('./routes/registrations');

// Inisialisasi aplikasi express
const app = express();

// Menentukan port untuk server
const PORT = process.env.PORT || 5000;

// Middleware dasar
app.use(cors());
app.use(express.json());

// Route sederhana untuk pengujian
app.get('/', (req, res) => {
  res.send('Halo! Server backend Anda sudah berjalan.');
});

// Gunakan rute autentikasi
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});