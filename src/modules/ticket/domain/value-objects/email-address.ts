import { Either, left, right } from '@/core/either';
import { ValueObject } from '@/core/entities/value-object';
import { InvalidEmailError } from '@/core/errors/invalid-email.error';

export interface EmailAddressProps {
  value: string;
}

export class EmailAddress extends ValueObject<EmailAddressProps> {
  private static EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  static create(value: string): Either<InvalidEmailError, EmailAddress> {
    const normalizedValue = value.trim().toLowerCase();

    if (!this.EMAIL_REGEX.test(normalizedValue)) {
      return left(new InvalidEmailError());
    }

    return right(new EmailAddress({ value: normalizedValue }));
  }

  get value(): string {
    return this.props.value;
  }

  get domain(): string {
    return this.props.value.split('@')[1];
  }
}
