import { Either, left, right } from '@/core/either';
import { ValueObject } from '@/core/entities/value-object';

export interface PasswordHasher {
  hash(plain: string): Promise<string>;
  compare(plain: string, hashed: string): Promise<boolean>;
}
export interface PasswordProps {
  value: string;
}

export class Password extends ValueObject<PasswordProps> {
  private static MIN_LENGTH = 8;
  private static MAX_LENGTH = 128;

  private constructor(props: PasswordProps) {
    super(props);
  }
  get value(): string {
    return this.props.value;
  }

  async compare(plain: string, hasher: PasswordHasher): Promise<boolean> {
    return hasher.compare(plain, this.props.value);
  }

  private static validate(plain: string): Either<string, true> {
    if (plain.length < this.MIN_LENGTH) {
      return left(`Password must be at least ${this.MIN_LENGTH} characters`);
    }

    if (plain.length > this.MAX_LENGTH) {
      return left(`Password must be at most ${this.MAX_LENGTH} characters`);
    }
    // verifica se existe pelo menos letra maíscula
    if (!/[A-Z]/.test(plain)) {
      return left(`Password must contain at least one uppercase letter`);
    }

    // verifica se existe pelo menos uma letra minuscula

    if (!/[a-z]/.test(plain)) {
      return left('Password must contain at least one lowercase letter');
    }

    // Pelo menos um número
    if (!/[0-9]/.test(plain)) {
      return left('Password must contain at least one number');
    }

    // Pelo menos um caractere especial
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(plain)) {
      return left('Password must contain at least one special character');
    }

    return right(true);
  }

  static async create(
    plain: string,
    hasher: PasswordHasher,
  ): Promise<Either<string, Password>> {
    const validation = this.validate(plain);
    if (validation.isLeft()) {
      return left(validation.value);
    }

    const hashed = await hasher.hash(plain);
    return right(new Password({ value: hashed }));
  }

  static fromHashed(hashed: string): Password {
    return new Password({ value: hashed });
  }
}
