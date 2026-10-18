
const winston = require('winston');
const path = require('path');
const fs = require('fs');

const directory = path.resolve(__dirname, '../../logs');

fs.mkdirSync(directory, { recursive: true });

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(directory, 'application.log')
    }),
    new winston.transports.File({
      filename: path.join(directory, 'errors.log'),
      level: 'error'
    })
  ]
});

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  })
);

module.exports = logger;
