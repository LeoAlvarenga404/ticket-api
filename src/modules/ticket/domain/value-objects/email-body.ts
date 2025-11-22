import { Either, left, right } from '@/core/either';
import { ValueObject } from '@/core/entities/value-object';
import { EmailBodyEmptyError } from '@/core/errors/email-body-empty.error';

export interface EmailBodyProps {
  bodyPlain: string;
  bodyRaw?: string;
}

export class EmailBody extends ValueObject<EmailBodyProps> {
  get bodyPlain(): string {
    return this.props.bodyPlain;
  }

  get bodyRaw(): string | undefined {
    return this.props.bodyRaw;
  }

  get hasHtml(): boolean {
    return !!this.props.bodyRaw;
  }

  get length(): number {
    return this.props.bodyPlain.length;
  }

  static create(
    bodyPlain: string,
    bodyRaw?: string,
  ): Either<EmailBodyEmptyError, EmailBody> {
    const cleanedBodyPlain = bodyPlain?.trim();

    if (!cleanedBodyPlain) {
      return left(new EmailBodyEmptyError());
    }

    return right(
      new EmailBody({
        bodyPlain: cleanedBodyPlain,
        bodyRaw: bodyRaw?.trim(),
      }),
    );
  }
}
