import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/auth';
import { logger } from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Authentication required. Please login to continue.' });
      return;
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`Auth error: ${error}`);
    res.status(401).json({ error: 'Your session has expired. Please login again.' });
  }
};

export const adminOnly = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== 'ADMIN') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
};

export const baOnly = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== 'BA') {
    res.status(403).json({ error: 'BA access required' });
    return;
  }
  next();
};

