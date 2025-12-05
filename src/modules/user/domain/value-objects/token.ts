import { ValueObject } from '@/core/entities/value-object';

interface TokenProps {
  value: string;
  expiresAt: Date;
  type: 'access_token' | 'refresh_token';
}

export class Token extends ValueObject<TokenProps> {
  get value(): string {
    return this.props.value;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get type(): 'access_token' | 'refresh_token' {
    return this.props.type;
  }

  get isExpired(): boolean {
    return new Date() > this.props.expiresAt;
  }

  get isValid(): boolean {
    return !this.isExpired;
  }

  static createAccessToken(
    value: string,
    expiresInMinutes: number = 15,
  ): Token {
    return new Token({
      value,
      expiresAt: new Date(Date.now() + expiresInMinutes * 60 * 1000),
      type: 'access_token',
    });
  }

  static createRefreshToken(value: string, expiresInDays: number = 7): Token {
    return new Token({
      value,
      expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
      type: 'refresh_token',
    });
  }

  static restore(
    value: string,
    expiresAt: Date,
    type: 'access_token' | 'refresh_token',
  ): Token {
    return new Token({ value, expiresAt, type });
  }
}
