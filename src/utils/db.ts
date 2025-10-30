import { MongoClient, Db } from 'mongodb';
import { config } from '../config/env';
import { logger } from './logger';

let db: Db;
let client: MongoClient;

export async function connectDB(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    const mongoOptions = {
      maxPoolSize: config.database.maxPoolSize,
      minPoolSize: config.database.minPoolSize,
      maxIdleTimeMS: config.database.maxIdleTimeMS,
      retryWrites: true,
      w: 'majority' as const,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    client = new MongoClient(config.database.url, mongoOptions);
    await client.connect();

    // Verify connection
    await client.db('admin').command({ ping: 1 });

    db = client.db(config.database.name);
    logger.info('✅ MongoDB connected successfully');
    logger.info(`📊 Connection pool size: ${config.database.maxPoolSize}`);
    return db;
  } catch (error) {
    logger.error(`❌ MongoDB connection failed: ${error}`);
    throw error;
  }
}

export function getDB(): Db {
  if (!db) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return db;
}

export async function disconnectDB(): Promise<void> {
  if (client) {
    await client.close();
    logger.info('MongoDB disconnected');
  }
}

export default { connectDB, getDB, disconnectDB };
