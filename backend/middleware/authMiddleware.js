const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Ambil token dari header request
  const token = req.header('Authorization');

  // 2. Cek jika tidak ada token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // 3. Verifikasi token
    const bearerToken = token.split(' ')[1];
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);

    // 4. Simpan data pengguna dari token ke object request
    req.user = decoded.user;
    next(); // Lanjutkan ke rute
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};