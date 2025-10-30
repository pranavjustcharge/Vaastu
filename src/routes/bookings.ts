import { Router } from 'express';
import { bookingController } from '../controllers/bookingController';
import { authMiddleware, adminOnly, baOnly } from '../middleware/auth';
import { body, query } from 'express-validator';
import { validationMiddleware } from '../middleware/validation';

const router = Router();

/**
 * Public Routes
 */

/**
 * POST /api/bookings
 * Create a new booking (public endpoint)
 */
router.post(
  '/',
  [
    body('clientName').trim().notEmpty().withMessage('Client name is required'),
    body('clientEmail').isEmail().withMessage('Valid email is required'),
    body('clientPhone').trim().notEmpty().withMessage('Phone number is required'),
    body('serviceType')
      .isIn(['BUSINESS_VASTU', 'RESIDENTIAL_VASTU', 'HEALING_SESSION', 'LAND_ENERGY'])
      .withMessage('Invalid service type'),
    body('preferredDate').isISO8601().withMessage('Valid date is required'),
    body('preferredTime')
      .matches(/^\d{2}:\d{2}\s(AM|PM)$/)
      .withMessage('Time must be in HH:MM AM/PM format'),
    body('referralCode').optional().trim(),
    body('couponCode').optional().trim(),
    body('description').optional().trim()
  ],
  validationMiddleware,
  bookingController.createBooking
);

/**
 * GET /api/bookings/:id
 * Get single booking details
 */
router.get('/:id', bookingController.getBooking);

/**
 * Protected Routes - BA
 */

/**
 * GET /api/ba/bookings
 * Get all bookings for a BA (via referral code)
 */
router.get(
  '/ba/my-bookings',
  authMiddleware,
  baOnly,
  bookingController.getBABookings
);

/**
 * Protected Routes - Admin
 */

/**
 * GET /api/admin/bookings
 * Get all bookings with filters
 */
router.get(
  '/admin/all',
  authMiddleware,
  adminOnly,
  [
    query('serviceType').optional().isIn(['BUSINESS_VASTU', 'RESIDENTIAL_VASTU', 'HEALING_SESSION', 'LAND_ENERGY']),
    query('status').optional().isIn(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601()
  ],
  validationMiddleware,
  bookingController.getAllBookings
);

/**
 * GET /api/admin/bookings/stats
 * Get booking statistics
 */
router.get(
  '/admin/stats',
  authMiddleware,
  adminOnly,
  bookingController.getBookingStats
);

/**
 * PATCH /api/admin/bookings/:id
 * Update booking status
 */
router.patch(
  '/admin/:id',
  authMiddleware,
  adminOnly,
  [
    body('status')
      .optional()
      .isIn(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'])
      .withMessage('Invalid status'),
    body('adminNotes').optional().trim()
  ],
  validationMiddleware,
  bookingController.updateBooking
);

export default router;

