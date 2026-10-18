
const jwt = require('jsonwebtoken');
const User = require('../features/auth/user.model');

async function requireAuth(req, res, next) {
  try {
    const header = req.get('authorization');

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'A Bearer token is required'
      });
    }

    const token = header.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is missing'
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload.sub) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token'
      });
    }

    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication account was not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Authentication token has expired'
      });
    }

    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'NotBeforeError' ||
      error.name === 'CastError'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token'
      });
    }

    next(error);
  }
}

module.exports = requireAuth;
