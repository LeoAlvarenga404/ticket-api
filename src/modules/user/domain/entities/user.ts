import { Entity } from '@/core/entities/entity';
import { Password, PasswordHasher } from '../value-objects/password';
import { AgentRole } from '../value-objects/agent-role';
import { DomainEvent } from '@/core/events/domain-event';
import { Either, left, right } from '@/core/either';
import { AgentProfile } from '../value-objects/agent-profile';
import { UserPromotedToAgentEvent } from '../events/user-promoted-to-agent.event';
import { PasswordChangedEvent } from '../events/password-changed.event';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { EmailAddress } from '@/modules/ticket/domain/value-objects/email-address';
import { UserCreatedEvent } from '../events/user-created.event';

interface UserProps {
  name: string;
  email: string;
  passwordHash: string;
  agentProfile?: AgentProfile;
  emailVerifiedAt: Date | null;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends Entity<UserProps> {
  private _domainEvents: DomainEvent[] = [];

  get name() {
    return this.props.name;
  }
  get email() {
    return this.props.email;
  }
  get passwordHash() {
    return this.props.passwordHash;
  }
  get agentProfile() {
    return this.props.agentProfile;
  }

  get emailVerifiedAt() {
    return this.props.emailVerifiedAt;
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

  get isAgent(): boolean {
    return !!this.props.agentProfile;
  }

  get isEmailVerified() {
    return !!this.props.emailVerifiedAt;
  }

  get domainEvents(): readonly DomainEvent[] {
    return this._domainEvents;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  clearEvents() {
    this._domainEvents = [];
  }

  promoteToAgent(tenantId: string, role: AgentRole): Either<Error, void> {
    if (this.isAgent) {
      return left(new Error('User is already an agent'));
    }

    this.props.agentProfile = AgentProfile.create({
      tenantId,
      role,
      status: 'active',
    });

    this.touch();

    this._domainEvents.push(new UserPromotedToAgentEvent(this, tenantId, role));

    return right(undefined);
  }

  remoteFromAgent(): Either<Error, void> {
    if (!this.isAgent) {
      return left(new Error('User is not an agent'));
    }

    this.props.agentProfile = undefined;
    this.touch();

    return right(undefined);
  }

  async verifyPassword(
    plainPassword: string,
    hasher: PasswordHasher,
  ): Promise<Either<'INVALID', true>> {
    const password = Password.fromHashed(this.props.passwordHash);
    const isValid = await password.compare(plainPassword, hasher);

    if (!isValid) {
      return left('INVALID');
    }

    return right(true);
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
    hasher: PasswordHasher,
  ): Promise<Either<'INVALID_CURRENT_PASSWORD' | 'WEAK_NEW_PASSWORD', void>> {
    const currentValid = await this.verifyPassword(currentPassword, hasher);

    if (currentValid.isLeft()) {
      return left('INVALID_CURRENT_PASSWORD');
    }

    const newPasswordResult = await Password.create(newPassword, hasher);

    if (newPasswordResult.isLeft()) {
      return left('WEAK_NEW_PASSWORD');
    }

    this.props.passwordHash = newPasswordResult.value.value;
    this.touch();

    this._domainEvents.push(new PasswordChangedEvent(this));
    return right(undefined);
  }

  async resetPassword(
    newPassword: string,
    hasher: PasswordHasher,
  ): Promise<Either<'WEAK_PASSWORD', void>> {
    const newPasswordResult = await Password.create(newPassword, hasher);

    if (newPasswordResult.isLeft()) {
      return left('WEAK_PASSWORD');
    }

    this.props.passwordHash = newPasswordResult.value.value;
    this.touch();

    this._domainEvents.push(new PasswordChangedEvent(this));

    return right(undefined);
  }

  verifyEmail(): void {
    if (this.isEmailVerified) return;

    this.props.emailVerifiedAt = new Date();
    this.touch();
  }

  updateLastLogin(): void {
    this.props.lastLoginAt = new Date();
    this.touch();
  }

  static async createNew(
    props: {
      name: string;
      email: string;
      password: string;
    },
    hasher: PasswordHasher,
  ): Promise<Either<'INVALID_EMAIL' | 'WEAK_PASSWORD', User>> {
    const emailResult = EmailAddress.create(props.email);

    if (emailResult.isLeft()) {
      return left('INVALID_EMAIL');
    }

    const passwordResult = await Password.create(props.password, hasher);
    if (passwordResult.isLeft()) {
      return left('WEAK_PASSWORD');
    }

    const user = new User({
      name: props.name.trim(),
      email: emailResult.value.value,
      passwordHash: passwordResult.value.value,
      emailVerifiedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    user._domainEvents.push(new UserCreatedEvent(user));

    return right(user);
  }

  static create(props: UserProps, id?: UniqueEntityID): User {
    return new User(
      {
        ...props,
      },
      id,
    );
  }
}
