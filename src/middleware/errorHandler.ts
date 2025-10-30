import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  logger.error(`Error: ${err.message}`);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      statusCode: err.statusCode,
    });
    return;
  }

  // Prisma validation errors
  if (err.message.includes('Unique constraint failed')) {
    res.status(409).json({
      error: 'This resource already exists. Please use a different value.',
      statusCode: 409,
    });
    return;
  }

  // Default error
  res.status(500).json({
    error: 'An unexpected error occurred. Please try again later or contact support.',
    statusCode: 500,
  });
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

