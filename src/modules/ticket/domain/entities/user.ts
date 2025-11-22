import { Entity } from '@/core/entities/entity';
import { Password, PasswordHasher } from '../value-objects/password';

interface UserProps {
  email: string;
  passwordHash: string;
  role: 'agent' | 'customer' | 'admin';
  tenantId?: string;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends Entity<UserProps> {
  get email() {
    return this.props.email;
  }
  get passwordHash() {
    return this.props.passwordHash;
  }
  get role() {
    return this.props.role;
  }
  get tenantId() {
    return this.props.tenantId;
  }
  get isEmailVerified() {
    return this.props.isEmailVerified;
  }
  get lastLoginAt() {
    return this.props.lastLoginAt;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  async verifyPassword(
    password: string,
    hasher: PasswordHasher,
  ): Promise<boolean> {
    const passwordVO = Password.fromHashed(this.props.passwordHash);
    return passwordVO.compare(password, hasher);
  }

  touch() {
    this.props.updatedAt = new Date();
  }

  changePassword(newPasswordHash: string): void {
    this.props.passwordHash = newPasswordHash;
    this.touch();
  }

  verifyEmail(): void {
    this.props.isEmailVerified = true;
    this.touch();
  }
}
