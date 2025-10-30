import { Request, Response } from 'express';
import { commissionService } from '../services/commissionService';
import { asyncHandler } from '../utils/asyncHandler';

export const getCommissionSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await commissionService.getSettings();
  res.status(200).json({ data: settings });
});

export const updateCommissionSettings = asyncHandler(async (req: Request, res: Response) => {
  const { commissionType, commissionValue, gstPercentage, excludeGSTFromBase } = req.body;

  // Validate that at least one field is provided
  if (
    commissionType === undefined &&
    commissionValue === undefined &&
    gstPercentage === undefined &&
    excludeGSTFromBase === undefined
  ) {
    res.status(400).json({ error: 'At least one field must be provided for update' });
    return;
  }

  const settings = await commissionService.updateSettings({
    commissionType,
    commissionValue,
    gstPercentage,
    excludeGSTFromBase,
  });

  res.status(200).json({ 
    data: settings,
    message: 'Commission settings updated successfully'
  });
});

export const getCommissionInfo = asyncHandler(async (_req: Request, res: Response) => {
  const info = await commissionService.getCommissionInfo();
  res.status(200).json({ data: info });
});

