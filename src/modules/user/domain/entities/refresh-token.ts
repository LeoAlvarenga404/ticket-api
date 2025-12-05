import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface RefreshTokenProps {
  userId: string;
  token: string; // Hash do token
  expiresAt: Date;
  createdAt: Date;
  revokedAt?: Date;
  revokedByIp?: string;
  replacedByToken?: string; // Para token rotation
  createdByIp?: string;
  userAgent?: string;
}

export class RefreshToken extends Entity<RefreshTokenProps> {
  get userId(): string {
    return this.props.userId;
  }

  get token(): string {
    return this.props.token;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get revokedAt(): Date | undefined {
    return this.props.revokedAt;
  }

  get createdByIp(): string | undefined {
    return this.props.createdByIp;
  }

  get userAgent(): string | undefined {
    return this.props.userAgent;
  }

  get isExpired(): boolean {
    return new Date() > this.props.expiresAt;
  }

  get isRevoked(): boolean {
    return !!this.props.revokedAt;
  }


  get isActive(): boolean {
    return !this.isExpired && !this.isRevoked;
  }

  revoke(ip?: string): void {
    if (this.isRevoked) return;

    this.props.revokedAt = new Date();
    this.props.revokedByIp = ip;
  }

  replaceWith(newTokenId: string, ip?: string): void {
    this.revoke(ip);
    this.props.replacedByToken = newTokenId;
  }

  static create(
    props: {
      userId: string;
      token: string;
      expiresInDays?: number;
      createdByIp?: string;
      userAgent?: string;
    },
    id?: UniqueEntityID,
  ): RefreshToken {
    const expiresInDays = props.expiresInDays ?? 7;

    return new RefreshToken(
      {
        userId: props.userId,
        token: props.token,
        expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        createdByIp: props.createdByIp,
        userAgent: props.userAgent,
      },
      id,
    );
  }
}
