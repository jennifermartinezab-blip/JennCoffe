const express = require('express');

const {
  login,
  logout
} = require('../controllers/authController');

const {
  verificarToken
} = require('../middlewares/authMiddleware');

const router = express.Router();

// RF14 - Login
router.post('/login', login);

// RF15 - Logout
router.post(
  '/logout',
  verificarToken,
  logout
);

module.exports = router;