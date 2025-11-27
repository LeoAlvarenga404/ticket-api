import { TenantEntity } from '@/core/entities/tenant-entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AgentRole, Permission } from '../value-objects/agent-role';
import { User } from './user';
import { DomainEvent } from '@/core/events/domain-event';
import { AgentRoleChangedEvent } from '../events/agent-role-changed.event';
import { AgentDeactivatedEvent } from '../events/agent-deactivated.event';
import { AgentActivatedEvent } from '../events/agent-activated.event';
import { AgentCreatedEvent } from '../events/agent-created.event';

interface AgentProps {
  userId: string;
  tenantId: string;
  name: string;
  email: string;
  role: AgentRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Agent extends TenantEntity<AgentProps> {
  private _domainEvents: DomainEvent[] = [];

  get userId() {
    return this.props.userId;
  }

  get tenantId() {
    return this.props.tenantId;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get role() {
    return this.props.role;
  }

  get isActive() {
    return this.props.isActive;
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

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  clearEvents(): void {
    this._domainEvents = [];
  }

  hasPermission(permission: Permission): boolean {
    return this.props.role.hasPermission(permission);
  }

  changeRole(newRole: AgentRole, changedBy: Agent): void {
    const oldRole = this.props.role;
    this.props.role = newRole;
    this.touch();

    this._domainEvents.push(
      new AgentRoleChangedEvent(this, oldRole, newRole, changedBy),
    );
  }
  deactivate(deactivatedBy: Agent | 'system'): void {
    if (!this.props.isActive) {
      return;
    }

    this.props.isActive = false;
    this.touch();

    this._domainEvents.push(new AgentDeactivatedEvent(this, deactivatedBy));
  }

  activate(activatedBy: Agent | 'system'): void {
    if (this.props.isActive) {
      return;
    }

    this.props.isActive = false;
    this.touch();

    this._domainEvents.push(new AgentActivatedEvent(this, activatedBy));
  }

  syncFromUser(user: User): void {
    if (!user.isAgent) {
      throw new Error('Cannot sync from non-agent user');
    }

    if (user.id.toString() !== this.props.userId) {
      throw new Error('User ID mismatch');
    }

    this.props.name = user.name;
    this.props.email = user.email;
    this.props.isActive = user.agentProfile!.isActive;
    this.props.role = user.agentProfile!.role;
    this.touch;
  }

  static fromUser(user: User): Agent {
    if (!user.isAgent) {
      throw new Error('cannot create agent from non-agent user!');
    }

    if (!user.agentProfile) {
      throw new Error('User does not have agent profile');
    }

    const agent = new Agent(
      {
        userId: user.id.toString(),
        tenantId: user.agentProfile.tenantId,
        name: user.name,
        email: user.email,
        role: user.agentProfile.role,
        isActive: user.agentProfile.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      new UniqueEntityID(user.id.toString()),
    );

    agent._domainEvents.push(new AgentCreatedEvent(agent));

    return agent;
  }

  static create(props: AgentProps, id?: UniqueEntityID): Agent {
    return new Agent(props, id);
  }
}
