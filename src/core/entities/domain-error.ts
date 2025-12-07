export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  readonly timestamp: Date;
  readonly context?: Record<string, unknown>;

  constructor(message: string, context?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
    this.context = context;
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      timestamp: this.timestamp,
      context: this.context,
    };
  }
}

export abstract class BadRequestError extends DomainError {
  readonly statusCode = 400;
}

export abstract class ValidationError extends DomainError {
  readonly statusCode = 400;
}

export abstract class UnauthorizedError extends DomainError {
  readonly statusCode = 401;
}

export abstract class AuthorizationError extends DomainError {
  readonly statusCode = 403;
}

export abstract class ForbiddenError extends DomainError {
  readonly statusCode = 403;
}

export abstract class NotFoundError extends DomainError {
  readonly statusCode = 404;
}

export abstract class ConflictError extends DomainError {
  readonly statusCode = 409;
}

export abstract class InternalServerError extends DomainError {
  readonly statusCode = 500;
}
