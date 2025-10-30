import { Request, Response } from 'express';
import { bookingService } from '../services/bookingService';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorHandler';

export class BookingController {
  /**
   * Create a new booking
   * POST /api/bookings
   */
  createBooking = asyncHandler(async (req: Request, res: Response) => {
    const {
      clientName,
      clientEmail,
      clientPhone,
      serviceType,
      description,
      preferredDate,
      preferredTime,
      referralCode,
      couponCode
    } = req.body;

    // Validation
    if (!clientName || !clientEmail || !clientPhone || !serviceType || !preferredDate || !preferredTime) {
      throw new AppError(400, 'Missing required fields');
    }

    const booking = await bookingService.createBooking({
      clientName,
      clientEmail,
      clientPhone,
      serviceType,
      description,
      preferredDate: new Date(preferredDate),
      preferredTime,
      referralCode,
      couponCode
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  });

  /**
   * Get all bookings (admin only)
   * GET /api/admin/bookings
   */
  getAllBookings = asyncHandler(async (req: Request, res: Response) => {
    const { serviceType, status, startDate, endDate } = req.query;

    const bookings = await bookingService.getAllBookings({
      serviceType: serviceType as any,
      status: status as any,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined
    });

    res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: bookings,
      count: bookings.length
    });
  });

  /**
   * Get bookings for a specific BA
   * GET /api/ba/bookings
   */
  getBABookings = asyncHandler(async (req: Request, res: Response) => {
    const baId = (req as any).user.id;

    const bookings = await bookingService.getBABookings(baId);

    res.status(200).json({
      success: true,
      message: 'BA bookings retrieved successfully',
      data: bookings,
      count: bookings.length
    });
  });

  /**
   * Get single booking
   * GET /api/bookings/:id
   */
  getBooking = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const booking = await bookingService.getBooking(id);

    res.status(200).json({
      success: true,
      message: 'Booking retrieved successfully',
      data: booking
    });
  });

  /**
   * Update booking status (admin only)
   * PATCH /api/admin/bookings/:id
   */
  updateBooking = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const booking = await bookingService.updateBooking(id, {
      status,
      adminNotes
    });

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  });

  /**
   * Get booking statistics (admin only)
   * GET /api/admin/bookings/stats
   */
  getBookingStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await bookingService.getBookingStats();

    res.status(200).json({
      success: true,
      message: 'Booking statistics retrieved successfully',
      data: stats
    });
  });
}

export const bookingController = new BookingController();

