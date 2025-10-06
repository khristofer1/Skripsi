const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../config/db');

// Rute: GET /api/users/me
// Mengambil data profil (termasuk poin) untuk pengguna yang sedang login
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const query = 'SELECT id, name, email, points FROM users WHERE id = ?';
    const [users] = await db.query(query, [req.user.id]);
    if (users.length === 0) {
      return res.status(404).send('User not found.');
    }
    res.json(users[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;