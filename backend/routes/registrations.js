const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../config/db');

const POINTS_PER_REGISTRATION = 10; // Tentukan jumlah poin per pendaftaran

// Rute: POST /api/registrations (CREATE - Terproteksi)
// Mendaftarkan pengguna yang login ke sebuah event
router.post('/', authMiddleware, async (req, res) => {
  const user_id = req.user.id;
  const { event_id } = req.body;

  if (!event_id) {
    return res.status(400).send('Event ID is required');
  }

  try {
    // 1. Cek apakah user sudah terdaftar di event ini sebelumnya
    const checkQuery = 'SELECT * FROM registrations WHERE user_id = ? AND event_id = ?';
    const [existingRegistrations] = await db.query(checkQuery, [user_id, event_id]);

    if (existingRegistrations.length > 0) {
      return res.status(400).send('User already registered for this event');
    }

    // 2. Jika belum, tambahkan data ke tabel registrations
    const insertQuery = 'INSERT INTO registrations (user_id, event_id) VALUES (?, ?)';
    await db.query(insertQuery, [user_id, event_id]);

    // 3. Tambahkan poin ke akun pengguna
    const updatePointsQuery = 'UPDATE users SET points = points + ? WHERE id = ?';
    await db.query(updatePointsQuery, [POINTS_PER_REGISTRATION, user_id]);

    res.status(201).send('Successfully registered for the event and points awarded');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;