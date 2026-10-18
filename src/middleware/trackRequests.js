
const logger = require('../shared/logger');

function trackRequests(req, res, next) {
  const startTime = process.hrtime.bigint();

  res.on('finish', () => {
    const elapsed = Number(
      process.hrtime.bigint() - startTime
    ) / 1000000;

    const details = {
      method: req.method,
      route: req.path,
      statusCode: res.statusCode,
      durationMs: Number(elapsed.toFixed(2)),
      userId: req.user?.id || null
    };

    if (res.statusCode >= 500) {
      logger.error('Request failed', details);
    } else if (res.statusCode >= 400) {
      logger.warn('Request rejected', details);
    } else {
      logger.info('Request completed', details);
    }
  });

  next();
}

module.exports = trackRequests;
