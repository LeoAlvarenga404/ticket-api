import { ValueObject } from '@/core/entities/value-object';
import { User } from '../entities/user';

interface TokenPayloadProps {
  userId: string;
  email: string;
  tenantId?: string;
  isAgent: boolean;
  agentRole?: string;
  permissions?: string[];
}

export class TokenPayload extends ValueObject<TokenPayloadProps> {
  get userId(): string {
    return this.props.userId;
  }
  get email(): string {
    return this.props.email;
  }
  get tenantId(): string | undefined {
    return this.props.tenantId;
  }
  get isAgent(): boolean {
    return this.props.isAgent;
  }
  get agentRole(): string | undefined {
    return this.props.agentRole;
  }
  get permissions(): string[] {
    return this.props.permissions ?? [];
  }

  toPlainObject(): Record<string, unknown> {
    return {
      sub: this.props.userId,
      email: this.props.email,
      tenantId: this.props.tenantId,
      isAgent: this.props.isAgent,
      agentRole: this.props.agentRole,
      permissions: this.props.permissions,
    };
  }
  static fromUser(user: User): TokenPayload {
    return new TokenPayload({
      userId: user.id.toString(),
      email: user.email,
      tenantId: user.agentProfile?.tenantId,
      isAgent: user.isAgent,
      agentRole: user.agentProfile?.role.value,
      permissions: user.agentProfile?.permissions ?? [],
    });
  }

  static fromDecoded(decoded: {
    sub: string;
    email: string;
    tenantId?: string;
    isAgent: boolean;
    agentRole?: string;
    permissions?: string[];
  }): TokenPayload {
    return new TokenPayload({
      userId: decoded.sub,
      email: decoded.email,
      tenantId: decoded.tenantId,
      isAgent: decoded.isAgent,
      agentRole: decoded.agentRole,
      permissions: decoded.permissions,
    });
  }
}
