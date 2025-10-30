import { getDB } from '../utils/db';
import { AppError } from '../middleware/errorHandler';

export interface CommissionSettings {
  commissionType: 'PERCENTAGE' | 'FIXED';
  commissionValue: number;
  gstPercentage: number;
  excludeGSTFromBase: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class CommissionService {
  /**
   * Get current commission settings
   */
  async getSettings(): Promise<CommissionSettings> {
    const db = getDB() as any;
    
    let settings = await db.collection('commissionsettings').findOne({});
    
    // If no settings exist, return defaults
    if (!settings) {
      settings = {
        commissionType: 'FIXED',
        commissionValue: 25000,
        gstPercentage: 18,
        excludeGSTFromBase: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    
    return settings;
  }

  /**
   * Update commission settings (admin only)
   */
  async updateSettings(data: Partial<CommissionSettings>): Promise<CommissionSettings> {
    const db = getDB() as any;

    // Validate commission type
    if (data.commissionType && !['PERCENTAGE', 'FIXED'].includes(data.commissionType)) {
      throw new AppError(400, 'Invalid commission type. Must be PERCENTAGE or FIXED.');
    }

    // Validate commission value
    if (data.commissionValue !== undefined) {
      if (data.commissionValue < 0) {
        throw new AppError(400, 'Commission value cannot be negative.');
      }
      
      if (data.commissionType === 'PERCENTAGE' || (data.commissionType === undefined)) {
        // Get current type if not provided
        const current = await this.getSettings();
        const type = data.commissionType || current.commissionType;
        
        if (type === 'PERCENTAGE' && data.commissionValue > 100) {
          throw new AppError(400, 'Commission percentage cannot exceed 100%.');
        }
      }
    }

    // Validate GST percentage
    if (data.gstPercentage !== undefined) {
      if (data.gstPercentage < 0 || data.gstPercentage > 100) {
        throw new AppError(400, 'GST percentage must be between 0 and 100.');
      }
    }

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const result = await db.collection('commissionsettings').findOneAndUpdate(
      {},
      { $set: updateData },
      { upsert: true, returnDocument: 'after' }
    );

    return result.value;
  }

  /**
   * Calculate commission for a transaction
   * @param transactionAmount - The base transaction amount (excluding GST)
   * @param settings - Commission settings
   * @returns Object with commission details
   */
  async calculateCommission(transactionAmount: number, settings?: CommissionSettings) {
    if (!settings) {
      settings = await this.getSettings();
    }

    let commission = 0;

    if (settings.commissionType === 'PERCENTAGE') {
      commission = (transactionAmount * settings.commissionValue) / 100;
    } else {
      commission = settings.commissionValue;
    }

    // Calculate GST on commission if not excluded from base
    let gst = 0;
    if (!settings.excludeGSTFromBase) {
      gst = (commission * settings.gstPercentage) / 100;
    }

    const totalCommission = commission + gst;

    return {
      baseCommission: commission,
      gst,
      totalCommission,
      commissionType: settings.commissionType,
      commissionValue: settings.commissionValue,
      gstPercentage: settings.gstPercentage,
    };
  }

  /**
   * Get commission info for display to BAs
   */
  async getCommissionInfo() {
    const settings = await this.getSettings();
    
    let description = '';
    if (settings.commissionType === 'PERCENTAGE') {
      description = `${settings.commissionValue}% of booking value`;
    } else {
      description = `₹${settings.commissionValue.toLocaleString('en-IN')} per successful referral`;
    }

    return {
      commissionType: settings.commissionType,
      commissionValue: settings.commissionValue,
      description,
      gstPercentage: settings.gstPercentage,
      excludeGSTFromBase: settings.excludeGSTFromBase,
    };
  }
}

export const commissionService = new CommissionService();

