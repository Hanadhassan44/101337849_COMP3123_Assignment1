
const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, login } = require('./auth.controller');

const router = express.Router();

const authenticationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication requests. Try again later.'
  }
});

router.post('/signup', authenticationLimiter, register);
router.post('/login', authenticationLimiter, login);

module.exports = router;
