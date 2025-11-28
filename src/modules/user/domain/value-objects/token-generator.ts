import { ValueObject } from '@/core/entities/value-object';

export interface TokenGenerator {
  tenantId: string;
  userId: string;
  email: string;
  isAgent: boolean;
}

export class TokenGenerator extends ValueObject<TokenGenerator> {
  private constructor(props: TokenGenerator) {
    super(props);
  }
  // TODO: create hashing
  async generate({ email, tenantId, userId, isAgent }) {
    return 'token-hashed';
  }
}
