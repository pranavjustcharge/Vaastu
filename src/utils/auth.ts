import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/env';

export interface JWTPayload {
  id: string;
  email: string;
  role: 'ADMIN' | 'BA';
}

export const generateToken = (payload: JWTPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwt.expiry as any,
  };
  return jwt.sign(payload, config.jwt.secret as string, options);
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwt.refreshExpiry as any,
  };
  return jwt.sign(payload, config.jwt.refreshSecret as string, options);
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, config.jwt.secret as string) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret as string) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateReferralCode = (): string => {
  return `REF-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
};

export const generateReferralLink = (code: string): string => {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  return `${baseUrl}/referral/${code}`;
};

