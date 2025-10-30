import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Register BA
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('firstName').notEmpty().trim(),
    body('lastName').notEmpty().trim(),
  ],
  authController.registerBA,
);

// Login (supports both email and username)
router.post(
  '/login',
  [
    body('email').optional().isEmail().normalizeEmail(),
    body('username').optional().notEmpty().trim(),
    body('password').notEmpty(),
  ],
  authController.loginUser,
);

// Refresh Token
router.post('/refresh', authController.refreshToken);

// Get Current User
router.get('/me', authMiddleware, authController.getMe);

export default router;

