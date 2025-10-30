import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { connectDB, disconnectDB } from './utils/db';
import authRoutes from './routes/auth';
import baRoutes from './routes/ba';
import adminRoutes from './routes/admin';
import bookingRoutes from './routes/bookings';
import commissionRoutes from './routes/commission';

const app = express();

// Security Headers Middleware
app.use((_req: Request, res: Response, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Permissions policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

// Middleware
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req: Request, _res: Response, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ba', baRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/commission', commissionRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start listening
    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });

    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(async () => {
        await disconnectDB();
        logger.info('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT received, shutting down gracefully');
      server.close(async () => {
        await disconnectDB();
        logger.info('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error}`);
    process.exit(1);
  }
}

startServer();

export default app;

