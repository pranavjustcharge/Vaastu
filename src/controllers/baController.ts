import { Request, Response } from 'express';
import { baService } from '../services/baService';
import { asyncHandler } from '../utils/asyncHandler';

export const createProfile = asyncHandler(async (req: Request, res: Response) => {
  const { phone, expertise, experience, bio, loginType, username, kycStatus, referralCode } = req.body;

  const profile = await baService.createProfile(req.user!.id, {
    phone,
    expertise,
    experience,
    bio,
    loginType,
    username,
    kycStatus: kycStatus || 'PENDING',
    referralCode
  });

  res.status(201).json(profile);
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await baService.getProfile(req.user!.id);
  res.status(200).json(profile);
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const { companyName, gstNumber, bankName, accountNumber, ifscCode, accountHolderName } = req.body;

  const profile = await baService.updateProfile(req.user!.id, {
    companyName,
    gstNumber,
    bankName,
    accountNumber,
    ifscCode,
    accountHolderName,
  });

  res.status(200).json(profile);
});

export const getReferralInfo = asyncHandler(async (req: Request, res: Response) => {
  const info = await baService.getReferralInfo(req.user!.id);
  res.status(200).json({ data: info });
});

export const getReferralStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await baService.getReferralStats(req.user!.id);
  res.status(200).json(stats);
});

export const getBABookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await baService.getBABookings(req.user!.id);
  res.status(200).json(bookings);
});

export const getWithdrawalHistory = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;

  const history = await baService.getWithdrawalHistory(req.user!.id, limit, offset);
  res.status(200).json(history);
});

export const requestWithdrawal = asyncHandler(async (req: Request, res: Response) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    res.status(400).json({ error: 'Valid amount required' });
    return;
  }

  const withdrawal = await baService.requestWithdrawal(req.user!.id, amount);
  res.status(201).json(withdrawal);
});

export const getAssignedCoupons = asyncHandler(async (req: Request, res: Response) => {
  const coupons = await baService.getAssignedCoupons(req.user!.id);
  res.status(200).json(coupons);
});

export const getCouponDetails = asyncHandler(async (req: Request, res: Response) => {
  const { couponId } = req.params;
  const coupon = await baService.getCouponDetails(req.user!.id, couponId);
  res.status(200).json(coupon);
});

