import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { authService } from '../services/authService';
import { asyncHandler } from '../utils/asyncHandler';

export const registerBA = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password, firstName, lastName } = req.body;
  const result = await authService.registerBA(email, password, firstName, lastName);

  res.status(201).json(result);
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Please provide either email or username along with password.',
      details: errors.array()
    });
    return;
  }

  const { email, password, username } = req.body;

  // Ensure at least one login method is provided
  if (!email && !username) {
    res.status(400).json({
      error: 'Please provide either email or username to login.'
    });
    return;
  }

  const result = await authService.loginUser(email, password, username);

  res.status(200).json(result);
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ error: 'Refresh token required' });
    return;
  }

  const result = await authService.refreshAccessToken(refreshToken);
  res.status(200).json(result);
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    user: req.user,
  });
});

