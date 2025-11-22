import { TenantEntity } from '@/core/entities/tenant-entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AgentRole, Permission } from '../value-objects/agent-role';
import { DomainEvent } from '@/core/events/domain-event';

interface AgentProps {
  tenantId: string;
  userId: string;
  name: string;
  email: string;
  role: AgentRole;
  status: 'active' | 'inactive';
  createdAt: Date;
  createdBy: Agent | 'system';
  updatedAt: Date;
}

export class Agent extends TenantEntity<AgentProps> {
  private _domainEvents: DomainEvent[] = [];

  get tenantId() {
    return this.props.tenantId;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get role() {
    return this.props.role;
  }

  get status() {
    return this.props.status;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  set email(email: string) {
    this.props.email = email;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  changeRole(newRole: AgentRole): void {
    this.props.role = newRole;
  }

  hasPermission(permission: Permission): boolean {
    return this.props.role.hasPermission(permission);
  }

  deactivate(): void {
    this.props.status = 'inactive';
    this.touch();
  }

  activate(): void {
    this.props.status = 'active';
    this.touch();
  }

  static create(_props: AgentProps, id?: UniqueEntityID) {
    const agent = new Agent({ ..._props }, id);
    return agent;
  }
}
