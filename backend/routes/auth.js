const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const REFERRAL_BONUS_POINTS = 50; // Tentukan jumlah poin bonus

// Rute: POST /api/auth/register (Dengan bonus dua arah)
router.post('/register', async (req, res) => {
  const { name, email, password, referralCode } = req.body;

  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const insertUserQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const [result] = await db.query(insertUserQuery, [name, email, hashedPassword]);
    const newUserId = result.insertId;

    if (referralCode) {
      const referrerId = parseInt(referralCode, 10);

      const [referrers] = await db.query('SELECT * FROM users WHERE id = ?', [referrerId]);
      if (referrers.length > 0) {
        // Beri bonus poin ke pengguna lama (referrer)
        await db.query('UPDATE users SET points = points + ? WHERE id = ?', [REFERRAL_BONUS_POINTS, referrerId]);

        // Beri bonus poin ke pengguna baru (referee)
        await db.query('UPDATE users SET points = points + ? WHERE id = ?', [REFERRAL_BONUS_POINTS, newUserId]);
        
        // Catat transaksi referral
        const insertReferralQuery = 'INSERT INTO referrals (referrer_id, referee_id, bonus_points_awarded) VALUES (?, ?, ?)';
        await db.query(insertReferralQuery, [referrerId, newUserId, REFERRAL_BONUS_POINTS]);
        
        console.log(`User ${referrerId} and new user ${newUserId} were awarded ${REFERRAL_BONUS_POINTS} points.`);
      }
    }

    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// ... (kode rute /login tidak berubah)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [users] = await db.query(query, [email]);
    if (users.length === 0) {
      return res.status(400).send('Invalid credentials');
    }
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


module.exports = router;