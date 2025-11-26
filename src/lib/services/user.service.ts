import { userRepository } from '@/lib/repositories';
import type { InsertUser } from '@/lib/repositories';

/**
 * User Service
 * Handles user-related business logic
 */
export class UserService {
  /**
   * Register a new user
   */
  async registerUser(data: InsertUser) {
    // Check if email already exists
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create user
    return await userRepository.create(data);
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string) {
    return await userRepository.findByEmail(email);
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string) {
    return await userRepository.findById(id);
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    userId: string,
    data: { name?: string; phone?: string; avatar_url?: string }
  ) {
    // Validate user exists
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update profile
    return await userRepository.updateProfile(userId, data);
  }

  /**
   * Update user avatar
   */
  async updateAvatar(userId: string, avatarUrl: string) {
    // Validate user exists
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return await userRepository.updateAvatar(userId, avatarUrl);
  }

  /**
   * Verify user email
   */
  async verifyEmail(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.email_verified) {
      throw new Error('Email already verified');
    }

    return await userRepository.verifyEmail(userId);
  }

  /**
   * Check if user has admin role
   */
  async isAdmin(userId: string): Promise<boolean> {
    const user = await userRepository.findById(userId);
    if (!user) return false;

    return ['staff', 'manager', 'owner'].includes(user.role);
  }

  /**
   * Get all admin users
   */
  async getAdminUsers() {
    return await userRepository.getAdminUsers();
  }
}

export const userService = new UserService();
