import { authService } from '../services/authService';
import { prisma } from '../utils/db';
import { AppError } from '../middleware/errorHandler';

jest.mock('../utils/db');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerBA', () => {
    it('should register a new BA successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'ba@example.com',
        password: 'hashed',
        role: 'BA',
        firstName: 'John',
        lastName: 'Doe',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      (prisma.bAProfile.create as jest.Mock).mockResolvedValue({});
      (prisma.referralCode.create as jest.Mock).mockResolvedValue({});

      const result = await authService.registerBA(
        'ba@example.com',
        'password123',
        'John',
        'Doe',
      );

      expect(result.email).toBe('ba@example.com');
      expect(result.role).toBe('BA');
    });

    it('should throw error if email already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        email: 'ba@example.com',
      });

      await expect(
        authService.registerBA('ba@example.com', 'password123', 'John', 'Doe'),
      ).rejects.toThrow(AppError);
    });
  });

  describe('loginUser', () => {
    it('should login user successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'ba@example.com',
        password: '$2a$10$hashedpassword',
        role: 'BA',
        firstName: 'John',
        lastName: 'Doe',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.loginUser('ba@example.com', 'password123');

      expect(result.user.email).toBe('ba@example.com');
      expect(result.token).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw error for invalid credentials', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.loginUser('ba@example.com', 'password123'),
      ).rejects.toThrow(AppError);
    });
  });
});

