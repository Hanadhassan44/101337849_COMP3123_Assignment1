
const logger = require('../shared/logger');

function errorHandler(error, req, res, next) {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON request body'
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'A record with these details already exists'
    });
  }

  if (
    error.name === 'ValidationError' ||
    error.name === 'CastError'
  ) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request data'
    });
  }

  logger.error('Application error', {
    method: req.method,
    route: req.path,
    error: error.message
  });

  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
}

module.exports = errorHandler;
