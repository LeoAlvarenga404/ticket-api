import { ValueObject } from '@/core/entities/value-object';
import { AgentRole, Permission } from './agent-role';

export interface AgentProfileProps {
  tenantId: string;
  role: AgentRole;
  status: 'active' | 'inactive';
  permissions?: Permission[];
}

export class AgentProfile extends ValueObject<AgentProfileProps> {
  get tenantId() {
    return this.props.tenantId;
  }

  get role() {
    return this.props.role;
  }

  get status() {
    return this.props.status;
  }

  get permissions() {
    return this.props.permissions;
  }

  get isActive() {
    return this.props.status === 'active';
  }

  hasPermission(permission: Permission): boolean {
    return this.props.permissions?.includes(permission) ?? false;
  }

  static create(props: AgentProfileProps): AgentProfile {
    return new AgentProfile({
      tenantId: props.tenantId,
      role: props.role,
      status: props.status,
      permissions: props.permissions ?? [],
    });
  }
}
