import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server Configuration
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5000',

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-key',
    expiry: process.env.JWT_EXPIRY || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },

  // CORS Configuration
  cors: {
    origin: (process.env.CORS_ORIGIN || 'http://localhost:5000,http://localhost:3000')
      .split(',')
      .map((origin: string) => origin.trim()), // Trim whitespace from each origin
  },

  // Database Configuration
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/vastu_db',
    name: process.env.DATABASE_NAME || 'vastu_db',
    maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || '10', 10),
    minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE || '2', 10),
    maxIdleTimeMS: parseInt(process.env.DB_MAX_IDLE_TIME_MS || '60000', 10),
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  // Admin Configuration
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
  },

  // Commission Configuration
  commission: {
    defaultType: process.env.DEFAULT_COMMISSION_TYPE || 'PERCENTAGE',
    defaultValue: parseFloat(process.env.DEFAULT_COMMISSION_VALUE || '10'),
    defaultGstPercentage: parseFloat(process.env.DEFAULT_GST_PERCENTAGE || '18'),
    excludeGstFromBase: process.env.DEFAULT_EXCLUDE_GST_FROM_BASE === 'true',
  },

  // Referral Configuration
  referral: {
    codePrefix: process.env.REFERRAL_CODE_PREFIX || 'BA',
    codeLength: parseInt(process.env.REFERRAL_CODE_LENGTH || '12', 10),
  },

  // File Upload Configuration
  fileUpload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
  },
};

// Validate required env vars
if (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
  throw new Error('DATABASE_URL is required in production');
}

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET is required in production');
}

