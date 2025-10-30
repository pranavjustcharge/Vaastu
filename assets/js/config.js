/**
 * Frontend Configuration
 * 
 * This file handles environment-based configuration for the frontend.
 * It automatically detects the environment and sets the correct API base URL.
 * 
 * Environment Detection:
 * - Development: localhost:5000 or localhost:3000
 * - Production: Vercel deployment or custom domain
 */

// Detect environment and set API base URL
function getApiBaseUrl() {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  // Development environments
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3000/api';
  }

  // Production environments
  // Check for environment variable (set by build process)
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Check for window variable (set in HTML or build)
  if (window.__API_BASE_URL__) {
    return window.__API_BASE_URL__;
  }

  // Vercel deployment - use Render backend
  if (hostname.includes('vercel.app')) {
    return 'https://vaastu.onrender.com/api';
  }

  // Custom domain
  if (hostname.includes('yourdomain.com')) {
    return 'https://vaastu.onrender.com/api';
  }

  // Default fallback - use Render backend
  return 'https://vaastu.onrender.com/api';
}

// Detect environment
function getEnvironment() {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  }
  
  if (hostname.includes('vercel.app')) {
    return 'production-vercel';
  }
  
  return 'production';
}

// Global configuration object
const APP_CONFIG = {
  // API Configuration
  API_BASE_URL: getApiBaseUrl(),
  API_TIMEOUT: 30000, // 30 seconds
  
  // Environment
  ENVIRONMENT: getEnvironment(),
  IS_DEVELOPMENT: getEnvironment() === 'development',
  IS_PRODUCTION: getEnvironment().includes('production'),
  
  // Feature Flags
  FEATURES: {
    REFERRAL_SYSTEM: true,
    COMMISSION_SETTINGS: true,
    WITHDRAWAL_REQUESTS: true,
    COUPON_CODES: true,
    KYC_VERIFICATION: true,
  },
  
  // UI Configuration
  UI: {
    TOAST_DURATION_SUCCESS: 8000,
    TOAST_DURATION_ERROR: 10000,
    TOAST_DURATION_INFO: 8000,
    TOAST_DURATION_WARNING: 8000,
    
    // Pagination
    ITEMS_PER_PAGE: 10,
    MAX_ITEMS_PER_PAGE: 100,
    
    // Timeouts
    FORM_SUBMIT_TIMEOUT: 30000,
    PAGE_LOAD_TIMEOUT: 10000,
  },
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication
    AUTH_LOGIN: '/auth/login',
    AUTH_REGISTER: '/auth/register',
    AUTH_REFRESH: '/auth/refresh',
    AUTH_LOGOUT: '/auth/logout',
    
    // Admin
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_BAS: '/admin/bas',
    ADMIN_WITHDRAWALS: '/admin/withdrawals',
    ADMIN_COUPONS: '/admin/coupons',
    ADMIN_COMMISSION: '/admin/commission',
    
    // BA
    BA_PROFILE: '/ba/profile',
    BA_DASHBOARD: '/ba/dashboard',
    BA_REFERRALS: '/ba/referrals',
    BA_WITHDRAWALS: '/ba/withdrawals',
    BA_ASSIGNED_COUPONS: '/ba/assigned-coupons',
    
    // Commission
    COMMISSION_INFO: '/commission/info',
    COMMISSION_SETTINGS: '/commission/settings',
    
    // Bookings
    BOOKINGS: '/bookings',
    BOOKINGS_ADMIN: '/bookings/admin',
    
    // Health
    HEALTH: '/health',
  },
  
  // Storage Keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'authToken',
    REFRESH_TOKEN: 'refreshToken',
    USER: 'user',
    PREFERENCES: 'userPreferences',
  },
  
  // Validation Rules
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
  },
  
  // Default Values
  DEFAULTS: {
    COMMISSION_TYPE: 'PERCENTAGE',
    COMMISSION_VALUE: 10,
    GST_PERCENTAGE: 18,
    CURRENCY: 'INR',
    CURRENCY_SYMBOL: '₹',
  },
};

// Helper function to get full API URL
function getFullApiUrl(endpoint) {
  return `${APP_CONFIG.API_BASE_URL}${endpoint}`;
}

// Helper function to check if feature is enabled
function isFeatureEnabled(featureName) {
  return APP_CONFIG.FEATURES[featureName] === true;
}

// Helper function to get storage value
function getStorageValue(key) {
  const value = localStorage.getItem(APP_CONFIG.STORAGE_KEYS[key]);
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return value;
  }
}

// Helper function to set storage value
function setStorageValue(key, value) {
  localStorage.setItem(
    APP_CONFIG.STORAGE_KEYS[key],
    typeof value === 'string' ? value : JSON.stringify(value)
  );
}

// Helper function to clear storage
function clearStorage() {
  Object.values(APP_CONFIG.STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

// Log configuration in development
if (APP_CONFIG.IS_DEVELOPMENT) {
  console.log('🔧 APP Configuration:', APP_CONFIG);
  console.log('📡 API Base URL:', APP_CONFIG.API_BASE_URL);
  console.log('🌍 Environment:', APP_CONFIG.ENVIRONMENT);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    APP_CONFIG,
    getFullApiUrl,
    isFeatureEnabled,
    getStorageValue,
    setStorageValue,
    clearStorage,
  };
}

