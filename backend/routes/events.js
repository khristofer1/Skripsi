const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Impor "satpam" kita
const db = require('../config/db');

// Rute: POST /api/events (CREATE - Terproteksi)
// Membuat event baru. Hanya bisa diakses oleh user yang sudah login.
router.post('/', authMiddleware, async (req, res) => {
  const organizer_id = req.user.id;
  const { title, description, event_date, location, price } = req.body;
  try {
    const query = 'INSERT INTO events (organizer_id, title, description, event_date, location, price) VALUES (?, ?, ?, ?, ?, ?)';
    await db.query(query, [organizer_id, title, description, event_date, location, price]);
    res.status(201).send('Event created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Rute: GET /api/events (READ - Publik)
// Mendapatkan semua event. Bisa diakses siapa saja.
router.get('/', async (req, res) => {
  try {
    const query = 'SELECT * FROM events ORDER BY event_date DESC';
    const [events] = await db.query(query);
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Rute: GET /api/events/:id (READ - Publik)
// Mendapatkan satu event spesifik berdasarkan ID. Bisa diakses siapa saja.
router.get('/:id', async (req, res) => {
  try {
    const query = 'SELECT * FROM events WHERE id = ?';
    const [events] = await db.query(query, [req.params.id]);
    if (events.length === 0) {
      return res.status(404).send('Event not found');
    }
    res.json(events[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.get('/my-events/all', authMiddleware, async (req, res) => {
  try {
    const query = 'SELECT * FROM events WHERE organizer_id = ? ORDER BY created_at DESC';
    const [myEvents] = await db.query(query, [req.user.id]);
    res.json(myEvents);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Rute: PUT /api/events/:id (UPDATE - Terproteksi)
// Memperbarui event. Hanya bisa dilakukan oleh pembuat event.
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, event_date, location, price } = req.body;
  const event_id = req.params.id;
  const user_id = req.user.id;

  try {
    // Verifikasi kepemilikan event
    const [events] = await db.query('SELECT organizer_id FROM events WHERE id = ?', [event_id]);
    if (events.length === 0) {
      return res.status(404).send('Event not found');
    }
    if (events[0].organizer_id !== user_id) {
      return res.status(401).send('User not authorized');
    }

    // Lakukan update
    const query = 'UPDATE events SET title = ?, description = ?, event_date = ?, location = ?, price = ? WHERE id = ?';
    await db.query(query, [title, description, event_date, location, price, event_id]);
    res.send('Event updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Rute: DELETE /api/events/:id (DELETE - Terproteksi)
// Menghapus event. Hanya bisa dilakukan oleh pembuat event.
router.delete('/:id', authMiddleware, async (req, res) => {
  const event_id = req.params.id;
  const user_id = req.user.id;

  try {
    // Verifikasi kepemilikan event
    const [events] = await db.query('SELECT organizer_id FROM events WHERE id = ?', [event_id]);
    if (events.length === 0) {
      return res.status(404).send('Event not found');
    }
    if (events[0].organizer_id !== user_id) {
      return res.status(401).send('User not authorized');
    }

    // Lakukan delete
    await db.query('DELETE FROM events WHERE id = ?', [event_id]);
    res.send('Event deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;