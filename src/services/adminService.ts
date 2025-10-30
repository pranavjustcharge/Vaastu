import { getDB } from '../utils/db';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../middleware/errorHandler';

export class AdminService {
  async getPendingBAs() {
    const db = getDB() as any;
    const bas = await db.collection('users').find({ role: 'BA' }).toArray();

    const result = [];
    for (const ba of bas) {
      const profile = await db.collection('baprofiles').findOne({ userId: ba._id });
      if (profile?.kycStatus === 'PENDING') {
        result.push({ ...ba, baProfile: profile });
      }
    }
    return result;
  }

  async approveBА(baId: string) {
    const db = getDB() as any;
    const result = await db.collection('baprofiles').findOneAndUpdate(
      { userId: baId },
      {
        $set: {
          kycStatus: 'APPROVED',
          kycApprovedAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      throw new AppError(404, 'BA profile not found');
    }

    return result.value;
  }

  async rejectBA(baId: string, _reason: string) {
    const db = getDB() as any;
    const result = await db.collection('baprofiles').findOneAndUpdate(
      { userId: baId },
      {
        $set: {
          kycStatus: 'REJECTED',
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      throw new AppError(404, 'BA profile not found');
    }

    return result.value;
  }

  async setCommission(
    commissionType: 'PERCENTAGE' | 'FIXED',
    commissionValue: number,
    baId?: string,
  ) {
    const db = getDB() as any;
    const existing = await db.collection('commissionsettings').findOne({ baId: baId || null });

    if (existing) {
      const result = await db.collection('commissionsettings').findOneAndUpdate(
        { _id: existing._id },
        {
          $set: {
            commissionType,
            commissionValue,
            updatedAt: new Date(),
          },
        },
        { returnDocument: 'after' }
      );
      return result.value;
    }

    const newSetting = {
      _id: uuidv4(),
      baId: baId || null,
      commissionType,
      commissionValue,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('commissionsettings').insertOne(newSetting);
    return newSetting;
  }

  async getCommissionSettings(baId?: string) {
    const db = getDB() as any;
    if (baId) {
      return db.collection('commissionsettings').findOne({ baId });
    }

    return db.collection('commissionsettings').findOne({ baId: null });
  }

  async createCoupon(
    code: string,
    discountPercentage: number,
    discountAmount?: number,
    globalUsageLimit?: number,
    expiryDate?: Date,
  ) {
    const db = getDB() as any;
    const existing = await db.collection('couponcodes').findOne({ code });
    if (existing) {
      throw new AppError(409, 'Coupon code already exists');
    }

    const coupon = {
      _id: uuidv4(),
      code,
      discountPercentage,
      discountAmount,
      globalUsageLimit,
      expiryDate,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('couponcodes').insertOne(coupon);
    return coupon;
  }

  async assignCouponToBA(
    couponId: string,
    baId: string,
    perUserUsageLimit?: number,
  ) {
    const db = getDB() as any;
    const existing = await db.collection('couponassignments').findOne({ couponId, baId });

    if (existing) {
      throw new AppError(409, 'Coupon already assigned to this BA');
    }

    const assignment = {
      _id: uuidv4(),
      couponId,
      baId,
      perUserUsageLimit,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('couponassignments').insertOne(assignment);
    return assignment;
  }

  async getPendingWithdrawals() {
    const db = getDB() as any;
    const withdrawals = await db
      .collection('withdrawalrequests')
      .find({ status: 'PENDING' })
      .sort({ createdAt: -1 })
      .toArray();

    const result = [];
    for (const withdrawal of withdrawals) {
      const ba = await db.collection('users').findOne({ _id: withdrawal.baId });
      result.push({
        ...withdrawal,
        ba: ba ? {
          id: ba._id,
          email: ba.email,
          firstName: ba.firstName,
          lastName: ba.lastName,
        } : null,
      });
    }
    return result;
  }

  async approveWithdrawal(withdrawalId: string, adminNotes?: string) {
    const db = getDB() as any;
    const result = await db.collection('withdrawalrequests').findOneAndUpdate(
      { _id: withdrawalId },
      {
        $set: {
          status: 'APPROVED',
          approvedAt: new Date(),
          adminNotes,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );
    return result.value;
  }

  async rejectWithdrawal(withdrawalId: string, adminNotes?: string) {
    const db = getDB() as any;
    const result = await db.collection('withdrawalrequests').findOneAndUpdate(
      { _id: withdrawalId },
      {
        $set: {
          status: 'REJECTED',
          adminNotes,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );
    return result.value;
  }

  async getDashboardStats() {
    const db = getDB() as any;

    const totalBAs = await db.collection('users').countDocuments({ role: 'BA' });
    const pendingKYC = await db.collection('baprofiles').countDocuments({ kycStatus: 'PENDING' });
    const pendingWithdrawals = await db.collection('withdrawalrequests').countDocuments({ status: 'PENDING' });

    const allWithdrawals = await db
      .collection('withdrawalrequests')
      .find({ status: 'COMPLETED' })
      .toArray();
    const totalPayoutProcessed = allWithdrawals.reduce((sum: number, w: any) => sum + (w.amount || 0), 0);

    return {
      totalBAs,
      pendingKYC,
      pendingWithdrawals,
      totalPayoutProcessed,
    };
  }
}

export const adminService = new AdminService();

