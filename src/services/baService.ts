import { getDB } from '../utils/db';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../middleware/errorHandler';

export class BAService {
  async createProfile(baId: string, data: any) {
    const db = getDB() as any;

    // Check if profile already exists
    const existingProfile = await db.collection('baprofiles').findOne({ userId: baId });
    if (existingProfile) {
      throw new AppError(400, 'You have already submitted a BA profile. Please wait for admin approval or contact support.');
    }

    // Validate all required fields before creating profile
    if (!data.phone || !data.expertise || data.experience === undefined || !data.bio) {
      throw new AppError(400, 'All profile fields are required. Please fill in all information.');
    }

    if (data.loginType === 'username' && !data.username) {
      throw new AppError(400, 'Username is required when selecting username as login method.');
    }

    // Check if username is already taken (if provided)
    if (data.username) {
      const existingUsername = await db.collection('baprofiles').findOne({ username: data.username });
      if (existingUsername) {
        throw new AppError(400, 'This username is already taken. Please choose a different username.');
      }
    }

    // Validate referral code if provided
    let referredByUserId = null;
    if (data.referralCode) {
      const referrerProfile = await db.collection('baprofiles').findOne({ referralCode: data.referralCode });
      if (!referrerProfile) {
        throw new AppError(400, 'Invalid referral code. Please check and try again.');
      }

      // Check if referrer is not rejected (allow PENDING and APPROVED)
      if (referrerProfile.kycStatus === 'REJECTED') {
        throw new AppError(400, 'This referral code is no longer active. Please use a valid referral code.');
      }

      referredByUserId = referrerProfile.userId;
    }

    // Generate unique referral code
    const referralCode = `BA${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const profile = {
      _id: uuidv4(),
      userId: baId,
      phone: data.phone,
      expertise: data.expertise,
      experience: data.experience,
      bio: data.bio,
      loginType: data.loginType,
      username: data.username || null,
      kycStatus: data.kycStatus || 'PENDING',
      referralCode,
      referredBy: referredByUserId || null,
      totalEarnings: 0,
      approvedEarnings: 0,
      pendingEarnings: 0,
      referredCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await db.collection('baprofiles').insertOne(profile);

      // If referred by someone, increment their referral count
      if (referredByUserId) {
        await db.collection('baprofiles').updateOne(
          { userId: referredByUserId },
          { $inc: { referredCount: 1 } }
        );
      }
    } catch (error) {
      // If profile creation fails, we don't delete the user
      // User can retry profile creation with different data
      throw new AppError(500, 'Failed to create BA profile. Please try again with different information.');
    }

    const user = await db.collection('users').findOne({ _id: baId });
    return {
      ...profile,
      user: user ? {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      } : null,
    };
  }

  async getProfile(baId: string) {
    const db = getDB() as any;
    const profile = await db.collection('baprofiles').findOne({ userId: baId });

    if (!profile) {
      throw new AppError(404, 'BA profile not found');
    }

    const user = await db.collection('users').findOne({ _id: baId });
    return {
      ...profile,
      user: user ? {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      } : null,
    };
  }

  async updateProfile(baId: string, data: any) {
    const db = getDB() as any;
    const result = await db.collection('baprofiles').findOneAndUpdate(
      { userId: baId },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      throw new AppError(404, 'BA profile not found');
    }

    const user = await db.collection('users').findOne({ _id: baId });
    return {
      ...result.value,
      user,
    };
  }

  async getReferralInfo(baId: string) {
    const db = getDB() as any;
    const profile = await db.collection('baprofiles').findOne({ userId: baId });

    if (!profile) {
      throw new AppError(404, 'BA profile not found');
    }

    // Get referred BAs
    const referredBAs = await db.collection('baprofiles')
      .find({ referredBy: baId })
      .sort({ createdAt: -1 })
      .toArray();

    // Get user details for referred BAs
    const referredBAsWithDetails = await Promise.all(
      referredBAs.map(async (ba: any) => {
        const user = await db.collection('users').findOne({ _id: ba.userId });
        return {
          id: ba._id,
          userId: ba.userId,
          name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
          email: user?.email,
          kycStatus: ba.kycStatus,
          createdAt: ba.createdAt,
        };
      })
    );

    return {
      referralCode: profile.referralCode,
      referralLink: `http://localhost:5000/business_associate.html?ref=${profile.referralCode}`,
      totalReferrals: profile.referredCount || 0,
      referredBAs: referredBAsWithDetails,
    };
  }

  async getReferralStats(baId: string) {
    const db = getDB() as any;
    const referralCode = await db.collection('referralcodes').findOne({ userId: baId });

    if (!referralCode) {
      throw new AppError(404, 'Referral code not found');
    }

    const transactions = await db.collection('referraltransactions').find({ referrerId: baId }).toArray();

    const totalEarnings = transactions.reduce((sum: number, t: any) => sum + (t.commissionAmount || 0), 0);
    const completedTransactions = transactions.filter((t: any) => t.status === 'COMPLETED');

    return {
      referralCode: referralCode.code,
      referralLink: referralCode.referralLink,
      totalReferrals: referralCode.totalReferrals || 0,
      successfulConversions: referralCode.successfulConversions || 0,
      totalEarnings,
      completedTransactions: completedTransactions.length,
      pendingTransactions: transactions.filter((t: any) => t.status === 'PENDING').length,
    };
  }

  async getBABookings(baId: string) {
    const db = getDB() as any;
    const bookings = await db
      .collection('bookings')
      .find({ baId })
      .sort({ createdAt: -1 })
      .toArray();

    return {
      data: bookings,
      total: bookings.length,
    };
  }

  async getWithdrawalHistory(baId: string, limit = 10, offset = 0) {
    const db = getDB() as any;
    const withdrawals = await db
      .collection('withdrawalrequests')
      .find({ baId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .toArray();

    const total = await db.collection('withdrawalrequests').countDocuments({ baId });

    return {
      withdrawals,
      total,
      limit,
      offset,
    };
  }

  async requestWithdrawal(baId: string, amount: number) {
    const db = getDB() as any;

    const profile = await db.collection('baprofiles').findOne({ userId: baId });

    if (!profile) {
      throw new AppError(404, 'BA profile not found');
    }

    if ((profile.approvedEarnings || 0) < amount) {
      throw new AppError(400, 'Insufficient approved earnings for withdrawal');
    }

    const withdrawal = {
      _id: uuidv4(),
      baId,
      amount,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('withdrawalrequests').insertOne(withdrawal);
    return withdrawal;
  }

  async getAssignedCoupons(baId: string) {
    const db = getDB() as any;
    const assignments = await db.collection('couponassignments').find({ baId }).toArray();

    const result = [];
    for (const assignment of assignments) {
      const coupon = await db.collection('couponcodes').findOne({ _id: assignment.couponId });
      result.push({
        ...assignment,
        coupon,
      });
    }
    return result;
  }

  async getCouponDetails(baId: string, couponId: string) {
    const db = getDB() as any;
    const assignment = await db.collection('couponassignments').findOne({ couponId, baId });

    if (!assignment) {
      throw new AppError(404, 'Coupon not assigned to this BA');
    }

    const coupon = await db.collection('couponcodes').findOne({ _id: couponId });
    return {
      ...assignment,
      coupon,
    };
  }
}

export const baService = new BAService();

