import { Router } from 'express';
import { body } from 'express-validator';
import * as adminController from '../controllers/adminController';
import { authMiddleware, adminOnly } from '../middleware/auth';

const router = Router();

// All admin routes require authentication and admin role
router.use(authMiddleware, adminOnly);

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// BA Management
router.get('/pending-bas', adminController.getPendingBAs);
router.post('/approve-ba/:baId', adminController.approveBA);
router.post(
  '/reject-ba/:baId',
  [body('reason').optional().trim()],
  adminController.rejectBA,
);

// Commission Settings
router.post(
  '/commission-settings',
  [
    body('commissionType').isIn(['PERCENTAGE', 'FIXED']),
    body('commissionValue').isFloat({ min: 0 }),
    body('baId').optional(),
  ],
  adminController.setCommission,
);
router.get('/commission-settings', adminController.getCommissionSettings);

// Coupon Management
router.post(
  '/create-coupon',
  [
    body('code').notEmpty().trim(),
    body('discountPercentage').isFloat({ min: 0, max: 100 }),
    body('discountAmount').optional().isFloat({ min: 0 }),
    body('globalUsageLimit').optional().isInt({ min: 1 }),
    body('expiryDate').optional().isISO8601(),
  ],
  adminController.createCoupon,
);

router.post(
  '/assign-coupon-to-ba',
  [
    body('couponId').notEmpty(),
    body('baId').notEmpty(),
    body('perUserUsageLimit').optional().isInt({ min: 1 }),
  ],
  adminController.assignCouponToBA,
);

// Withdrawal Management
router.get('/pending-withdrawals', adminController.getPendingWithdrawals);
router.post(
  '/approve-withdrawal/:withdrawalId',
  [body('adminNotes').optional().trim()],
  adminController.approveWithdrawal,
);
router.post(
  '/reject-withdrawal/:withdrawalId',
  [body('adminNotes').optional().trim()],
  adminController.rejectWithdrawal,
);

export default router;

