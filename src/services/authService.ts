import { getDB } from '../utils/db';
import { v4 as uuidv4 } from 'uuid';
import {
  hashPassword,
  comparePassword,
  generateToken,
  generateRefreshToken,
} from '../utils/auth';
import { AppError } from '../middleware/errorHandler';

export class AuthService {
  async registerBA(email: string, password: string, firstName: string, lastName: string) {
    const db = getDB() as any;

    // Check if user exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      throw new AppError(409, 'This email is already registered. Please use a different email address or login if you already have an account.');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    const userId = uuidv4();

    // Create user with BA role
    const user = {
      _id: userId,
      email,
      password: hashedPassword,
      role: 'BA',
      firstName,
      lastName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await db.collection('users').insertOne(user);
    } catch (error) {
      throw new AppError(500, 'Failed to create user account. Please try again.');
    }

    // Note: BA profile creation is done separately in the frontend after user registration
    // This ensures the user can complete their profile information before final submission
    // If profile creation fails, the user can retry without re-registering

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role as 'BA' | 'ADMIN',
    });

    const refreshToken = generateRefreshToken({
      id: user._id,
      email: user.email,
      role: user.role as 'BA' | 'ADMIN',
    });

    return {
      token,
      refreshToken,
      user: {
        id: userId,
        email,
        role: 'BA',
        firstName,
        lastName,
      },
    };
  }

  async loginUser(email?: string, password?: string, username?: string) {
    const db = getDB() as any;

    // Find user by email or username
    let user;
    if (email) {
      user = await db.collection('users').findOne({ email });
    } else if (username) {
      // Find BA profile with username (case-insensitive), then get user
      const baProfile = await db.collection('baprofiles').findOne({
        username: { $regex: `^${username}$`, $options: 'i' }
      });
      if (baProfile) {
        user = await db.collection('users').findOne({ _id: baProfile.userId });
      }
    }

    if (!user) {
      throw new AppError(401, 'Invalid email/username or password. Please check and try again.');
    }

    // Check if BA is approved (if BA role)
    if (user.role === 'BA') {
      const baProfile = await db.collection('baprofiles').findOne({ userId: user._id });
      if (!baProfile) {
        throw new AppError(403, 'Your BA profile is not yet created. Please complete your registration.');
      }
      if (baProfile.kycStatus === 'REJECTED') {
        throw new AppError(403, 'Your application has been rejected. Please contact support for more information.');
      }
      // Allow login for PENDING and APPROVED status
      // User can see their pending status in the dashboard
    }

    const isPasswordValid = await comparePassword(password || '', user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email/username or password. Please check and try again.');
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const { verifyRefreshToken } = await import('../utils/auth');
    const decoded = verifyRefreshToken(refreshToken);

    const db = getDB() as any;
    const user = await db.collection('users').findOne({ _id: decoded.id });
    if (!user) {
      throw new AppError(401, 'User not found');
    }

    const newToken = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return { token: newToken };
  }
}

export const authService = new AuthService();

