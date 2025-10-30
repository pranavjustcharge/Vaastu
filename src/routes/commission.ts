import { Router } from 'express';
import { body } from 'express-validator';
import * as commissionController from '../controllers/commissionController';
import { authMiddleware, adminOnly } from '../middleware/auth';

const router = Router();

// Get commission info (public - for BAs to see current commission structure)
router.get('/info', commissionController.getCommissionInfo);

// All admin routes require authentication and admin role
router.use(authMiddleware, adminOnly);

// Get current commission settings (admin only)
router.get('/settings', commissionController.getCommissionSettings);

// Update commission settings (admin only)
router.put(
  '/settings',
  [
    body('commissionType').optional().isIn(['PERCENTAGE', 'FIXED']),
    body('commissionValue').optional().isFloat({ min: 0 }),
    body('gstPercentage').optional().isFloat({ min: 0, max: 100 }),
    body('excludeGSTFromBase').optional().isBoolean(),
  ],
  commissionController.updateCommissionSettings,
);

export default router;

