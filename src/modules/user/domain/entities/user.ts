import { Entity } from '@/core/entities/entity';
import { Password, PasswordHasher } from '../value-objects/password';
import { AgentRole } from '../value-objects/agent-role';
import { DomainEvent } from '@/core/events/domain-event';
import { Either, left, right } from '@/core/either';
import { AgentProfile } from '../value-objects/agent-profile';
import { UserPromotedToAgentEvent } from '../events/user-promoted-to-agent.event';

interface UserProps {
  name: string;
  email: string;
  passwordHash: string;
  agentProfile?: AgentProfile;
  isEmailVerified: boolean;
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

  get isAgent(): boolean {
    return !!this.props.agentProfile;
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

  get isEmailVerified() {
    return this.props.isEmailVerified;
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

  get domainEvents(): readonly DomainEvent[] {
    return this._domainEvents;
  }

  clearEvents() {
    this._domainEvents = [];
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  async verifyPassword(
    password: string,
    hasher: PasswordHasher,
  ): Promise<boolean> {
    const passwordVO = Password.fromHashed(this.props.passwordHash);
    return passwordVO.compare(password, hasher);
  }

  changePassword(newPasswordHash: string): void {
    this.props.passwordHash = newPasswordHash;
    this.touch();
  }

  verifyEmail(): void {
    this.props.isEmailVerified = true;
    this.touch();
  }

  static create(props: UserProps) {
    return new User({
      ...props,
      agentProfile: props.agentProfile ?? undefined,
    });
  }
}
