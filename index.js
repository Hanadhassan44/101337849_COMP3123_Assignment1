
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const connectDatabase = require('./src/database/connection');
const logger = require('./src/shared/logger');

const trackRequests = require('./src/middleware/trackRequests');
const errorHandler = require('./src/middleware/errorHandler');

const authRoutes = require('./src/features/auth/auth.routes');
const employeeRoutes = require('./src/features/employees/employee.routes');

const app = express();
const port = Number(process.env.PORT) || 5000;

app.disable('x-powered-by');

app.use(helmet());
app.use(cors());
app.use(trackRequests);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'API request limit exceeded'
  }
});

app.use('/api', apiLimiter);

app.use('/api/v1/user', authRoutes);
app.use('/api/v1/emp', employeeRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'employee-management-api',
    timestamp: new Date().toISOString(),
    database:
      mongoose.connection.readyState === 1
        ? 'connected'
        : 'disconnected'
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'The requested endpoint does not exist'
  });
});

app.use(errorHandler);

async function startApplication() {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    await connectDatabase();

    logger.info('MongoDB connection established');

    app.listen(port, () => {
      logger.info('HTTP server started', { port });
    });
  } catch (error) {
    logger.error('Application startup failed', {
      error: error.message
    });

    process.exit(1);
  }
}

startApplication();
