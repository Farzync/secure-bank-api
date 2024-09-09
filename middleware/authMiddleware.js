const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authenticate = (req, res, next) => {
  // Ambil header authorization
  const authHeader = req.headers['authorization'];

  // Cek apakah header authorization ada dan memiliki format 'Bearer <token>'
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'No token provided or incorrect format' });
  }

  // Ambil token setelah 'Bearer ' (index ke-7 ke depan)
  const token = authHeader.split(' ')[1]; // atau authHeader.slice(7)

  if (!token) {
    return res.status(403).json({ message: 'Token missing or malformed' });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Tambahkan informasi user yang didecode ke request
    req.user = decoded;

    // Lanjutkan ke middleware berikutnya
    next();
  } catch (error) {
    // Respon Unauthorized jika verifikasi gagal
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
