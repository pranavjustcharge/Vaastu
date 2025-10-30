import { getDB } from '../utils/db';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../middleware/errorHandler';
import { commissionService } from './commissionService';

export interface CreateBookingDTO {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  description?: string;
  preferredDate: Date;
  preferredTime: string;
  referralCode?: string;
  couponCode?: string;
}

export interface UpdateBookingDTO {
  status?: string;
  adminNotes?: string;
}

export class BookingService {
  /**
   * Create a new booking
   */
  async createBooking(data: CreateBookingDTO) {
    try {
      // Validate service type
      const validServiceTypes = ['BUSINESS_VASTU', 'RESIDENTIAL_VASTU', 'HEALING_SESSION', 'LAND_ENERGY'];
      if (!validServiceTypes.includes(data.serviceType)) {
        throw new AppError(400, 'Please select a valid service type.');
      }

      // Validate date is in future
      if (new Date(data.preferredDate) < new Date()) {
        throw new AppError(400, 'Please select a date in the future.');
      }

      // Validate time format (HH:MM AM/PM)
      if (!/^\d{2}:\d{2}\s(AM|PM)$/.test(data.preferredTime)) {
        throw new AppError(400, 'Please enter time in HH:MM AM/PM format (e.g., 02:30 PM).');
      }

      let referrerId: string | null = null;
      let discountApplied = 0;

      const db = getDB() as any;

      // If referral code provided, validate and get referrer
      if (data.referralCode) {
        const referralCode = await db.collection('referralcodes').findOne({ code: data.referralCode });

        if (!referralCode) {
          throw new AppError(400, 'The referral code you entered is invalid or inactive. Please check and try again.');
        }

        referrerId = referralCode.userId;
      }

      // If coupon code provided, validate and calculate discount
      if (data.couponCode) {
        const coupon = await db.collection('couponcodes').findOne({ code: data.couponCode });

        if (!coupon) {
          throw new AppError(400, 'The coupon code you entered is not found. Please check and try again.');
        }

        if (!coupon.isActive) {
          throw new AppError(400, 'This coupon code is currently inactive. Please try another coupon.');
        }

        if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
          throw new AppError(400, 'This coupon code has expired. Please use a valid coupon.');
        }

        // Calculate discount (simplified - in real app, would need service pricing)
        discountApplied = coupon.discountPercentage || coupon.discountAmount || 0;
      }

      // Create booking
      const booking = {
        _id: uuidv4(),
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        serviceType: data.serviceType,
        description: data.description,
        preferredDate: new Date(data.preferredDate),
        preferredTime: data.preferredTime,
        referralCode: data.referralCode,
        referrerId: referrerId,
        couponCode: data.couponCode,
        discountApplied: discountApplied,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection('bookings').insertOne(booking);

      // Update coupon usage if applied
      if (data.couponCode) {
        await db.collection('couponcodes').updateOne(
          { code: data.couponCode },
          { $inc: { globalUsageCount: 1 } }
        );
      }

      // Update referral code stats if used
      if (data.referralCode) {
        await db.collection('referralcodes').updateOne(
          { code: data.referralCode },
          { $inc: { totalReferrals: 1 } }
        );
      }

      return booking;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to create booking');
    }
  }

  /**
   * Get all bookings (admin only)
   */
  async getAllBookings(filters?: {
    serviceType?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    try {
      const db = getDB() as any;
      const query: any = {};

      if (filters?.serviceType) query.serviceType = filters.serviceType;
      if (filters?.status) query.status = filters.status;

      if (filters?.startDate || filters?.endDate) {
        query.preferredDate = {};
        if (filters.startDate) query.preferredDate.$gte = new Date(filters.startDate);
        if (filters.endDate) query.preferredDate.$lte = new Date(filters.endDate);
      }

      return await db
        .collection('bookings')
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();
    } catch (error) {
      throw new AppError(500, 'Failed to fetch bookings');
    }
  }

  /**
   * Get bookings for a specific BA (via referral code)
   */
  async getBABookings(baId: string) {
    try {
      const db = getDB() as any;
      return await db
        .collection('bookings')
        .find({ referrerId: baId })
        .sort({ createdAt: -1 })
        .toArray();
    } catch (error) {
      throw new AppError(500, 'Failed to fetch BA bookings');
    }
  }

  /**
   * Get single booking
   */
  async getBooking(bookingId: string) {
    try {
      const db = getDB() as any;
      const booking = await db.collection('bookings').findOne({ _id: bookingId });

      if (!booking) {
        throw new AppError(404, 'Booking not found');
      }

      return booking;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to fetch booking');
    }
  }

  /**
   * Update booking status (admin only)
   */
  async updateBooking(bookingId: string, data: UpdateBookingDTO) {
    try {
      const db = getDB() as any;
      const booking = await db.collection('bookings').findOne({ _id: bookingId });

      if (!booking) {
        throw new AppError(404, 'Booking not found');
      }

      const result = await db.collection('bookings').findOneAndUpdate(
        { _id: bookingId },
        {
          $set: {
            status: data.status,
            adminNotes: data.adminNotes,
            updatedAt: new Date(),
          },
        },
        { returnDocument: 'after' }
      );

      // If booking confirmed, create referral transaction
      if (data.status === 'CONFIRMED' && booking.referrerId) {
        await this.createReferralTransaction(booking);
      }

      return result.value;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to update booking');
    }
  }

  /**
   * Create referral transaction when booking is confirmed
   */
  private async createReferralTransaction(booking: any) {
    try {
      const db = getDB() as any;

      // Get global commission settings using commissionService
      const settings = await commissionService.getSettings();

      if (!settings) {
        console.warn('No commission setting found for booking:', booking._id);
        return;
      }

      // Calculate commission using commissionService
      // For referral-based commission, we use a fixed base amount or booking value
      const baseAmount = booking.serviceAmount || 1000; // Use booking service amount if available
      const commissionDetails = await commissionService.calculateCommission(baseAmount, settings);

      // Create referral transaction
      await db.collection('referraltransactions').insertOne({
        _id: uuidv4(),
        referrerId: booking.referrerId,
        referralCode: booking.referralCode || '',
        customerEmail: booking.clientEmail,
        baseAmount: baseAmount,
        baseCommission: commissionDetails.baseCommission,
        gstAmount: commissionDetails.gst,
        totalCommissionAmount: commissionDetails.totalCommission,
        commissionType: settings.commissionType,
        commissionValue: settings.commissionValue,
        gstPercentage: settings.gstPercentage,
        excludeGSTFromBase: settings.excludeGSTFromBase,
        status: 'COMPLETED',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Update BA earnings with base commission (excluding GST)
      await db.collection('baprofiles').updateOne(
        { userId: booking.referrerId },
        {
          $inc: {
            totalEarnings: commissionDetails.baseCommission,
            approvedEarnings: commissionDetails.baseCommission,
          },
        }
      );

      // Update referral code conversion count
      if (booking.referralCode) {
        await db.collection('referralcodes').updateOne(
          { code: booking.referralCode },
          { $inc: { successfulConversions: 1 } }
        );
      }
    } catch (error) {
      console.error('Failed to create referral transaction:', error);
    }
  }

  /**
   * Get booking statistics
   */
  async getBookingStats() {
    try {
      const db = getDB() as any;
      const total = await db.collection('bookings').countDocuments();

      const byStatus = await db
        .collection('bookings')
        .aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ])
        .toArray();

      const byService = await db
        .collection('bookings')
        .aggregate([
          { $group: { _id: '$serviceType', count: { $sum: 1 } } },
        ])
        .toArray();

      return {
        total,
        byStatus,
        byService,
      };
    } catch (error) {
      throw new AppError(500, 'Failed to fetch booking statistics');
    }
  }
}

export const bookingService = new BookingService();

