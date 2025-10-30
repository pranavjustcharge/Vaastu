import { Router } from 'express';
import { body } from 'express-validator';
import * as baController from '../controllers/baController';
import { authMiddleware, baOnly } from '../middleware/auth';

const router = Router();

// All BA routes require authentication and BA role
router.use(authMiddleware, baOnly);

// Profile endpoints
router.post(
  '/profile',
  [
    body('phone').isMobilePhone('en-IN'),
    body('expertise').notEmpty().trim(),
    body('experience').isInt({ min: 0 }),
    body('bio').notEmpty().trim(),
    body('loginType').isIn(['email', 'username']),
    body('username').optional().trim(),
    body('kycStatus').optional().isIn(['PENDING', 'APPROVED', 'REJECTED']),
  ],
  baController.createProfile,
);

router.get('/profile', baController.getProfile);
router.put(
  '/profile',
  [
    body('companyName').optional().trim(),
    body('gstNumber').optional().trim(),
    body('bankName').optional().trim(),
    body('accountNumber').optional().trim(),
    body('ifscCode').optional().trim(),
    body('accountHolderName').optional().trim(),
  ],
  baController.updateProfile,
);

// Referral endpoints
router.get('/referral-info', baController.getReferralInfo);
router.get('/referral-stats', baController.getReferralStats);
router.get('/bookings', baController.getBABookings);

// Withdrawal endpoints
router.get('/withdrawal-history', baController.getWithdrawalHistory);
router.post(
  '/request-withdrawal',
  [body('amount').isFloat({ min: 0.01 })],
  baController.requestWithdrawal,
);

// Coupon endpoints
router.get('/assigned-coupons', baController.getAssignedCoupons);
router.get('/coupons/:couponId', baController.getCouponDetails);

export default router;

