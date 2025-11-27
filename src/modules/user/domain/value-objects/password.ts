import { ValueObject } from '@/core/entities/value-object';

export interface PasswordHasher {
  hash(plain: string): Promise<string>;
  compare(plain: string, hashed: string): Promise<boolean>;
}
export interface PasswordProps {
  hashed: string;
}

export class Password extends ValueObject<PasswordProps> {
  private constructor(props: PasswordProps) {
    super(props);
  }

  static async create(passwordPlain: string, hasher: PasswordHasher) {
    const hashed = await hasher.hash(passwordPlain);
    return new Password({ hashed });
  }

  static fromHashed(hashed: string) {
    return new Password({ hashed });
  }

  async compare(plain: string, hasher: PasswordHasher): Promise<boolean> {
    return hasher.compare(plain, this.props.hashed);
  }

  get value(): string {
    return this.props.hashed;
  }
}
