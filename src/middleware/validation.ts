import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from './errorHandler';

/**
 * Validation middleware to handle express-validator errors
 */
export const validationMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: 'param' in err ? err.param : 'unknown',
      message: err.msg
    }));

    throw new AppError(
      400,
      `Validation failed: ${errorMessages.map(e => `${e.field}: ${e.message}`).join(', ')}`
    );
  }

  next();
};

