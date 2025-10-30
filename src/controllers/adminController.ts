import { Request, Response } from 'express';
import { adminService } from '../services/adminService';
import { asyncHandler } from '../utils/asyncHandler';

export const getPendingBAs = asyncHandler(async (_req: Request, res: Response) => {
  const bas = await adminService.getPendingBAs();
  res.status(200).json(bas);
});

export const approveBA = asyncHandler(async (req: Request, res: Response) => {
  const { baId } = req.params;
  const profile = await adminService.approveBА(baId);
  res.status(200).json(profile);
});

export const rejectBA = asyncHandler(async (req: Request, res: Response) => {
  const { baId } = req.params;
  const { reason } = req.body;
  const profile = await adminService.rejectBA(baId, reason);
  res.status(200).json(profile);
});

export const setCommission = asyncHandler(async (req: Request, res: Response) => {
  const { commissionType, commissionValue, baId } = req.body;

  if (!commissionType || !commissionValue) {
    res.status(400).json({ error: 'Commission type and value required' });
    return;
  }

  const setting = await adminService.setCommission(commissionType, commissionValue, baId);
  res.status(200).json(setting);
});

export const getCommissionSettings = asyncHandler(async (req: Request, res: Response) => {
  const { baId } = req.query;
  const setting = await adminService.getCommissionSettings(baId as string);
  res.status(200).json(setting);
});

export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { code, discountPercentage, discountAmount, globalUsageLimit, expiryDate } = req.body;

  if (!code || !discountPercentage) {
    res.status(400).json({ error: 'Code and discount percentage required' });
    return;
  }

  const coupon = await adminService.createCoupon(
    code,
    discountPercentage,
    discountAmount,
    globalUsageLimit,
    expiryDate ? new Date(expiryDate) : undefined,
  );

  res.status(201).json(coupon);
});

export const assignCouponToBA = asyncHandler(async (req: Request, res: Response) => {
  const { couponId, baId, perUserUsageLimit } = req.body;

  if (!couponId || !baId) {
    res.status(400).json({ error: 'Coupon ID and BA ID required' });
    return;
  }

  const assignment = await adminService.assignCouponToBA(couponId, baId, perUserUsageLimit);
  res.status(201).json(assignment);
});

export const getPendingWithdrawals = asyncHandler(async (_req: Request, res: Response) => {
  const withdrawals = await adminService.getPendingWithdrawals();
  res.status(200).json(withdrawals);
});

export const approveWithdrawal = asyncHandler(async (req: Request, res: Response) => {
  const { withdrawalId } = req.params;
  const { adminNotes } = req.body;

  const withdrawal = await adminService.approveWithdrawal(withdrawalId, adminNotes);
  res.status(200).json(withdrawal);
});

export const rejectWithdrawal = asyncHandler(async (req: Request, res: Response) => {
  const { withdrawalId } = req.params;
  const { adminNotes } = req.body;

  const withdrawal = await adminService.rejectWithdrawal(withdrawalId, adminNotes);
  res.status(200).json(withdrawal);
});

export const getAllUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await adminService.getAllUsers();
  res.status(200).json({
    success: true,
    message: 'Users retrieved successfully',
    data: users,
    count: users.length
  });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await adminService.deleteUser(userId);
  res.status(200).json({
    success: true,
    message: result.message,
    data: result.deletedUser
  });
});

export const toggleUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = await adminService.toggleUserStatus(userId);
  res.status(200).json({
    success: true,
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    data: user
  });
});

export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await adminService.getDashboardStats();
  res.status(200).json(stats);
});

