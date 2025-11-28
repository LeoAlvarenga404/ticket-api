import { ValueObject } from '@/core/entities/value-object';

export enum AgentRoles {
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  AGENT = 'agent',
  VIEWER = 'viewer',
}

export enum Permission {
  TICKET_VIEW_ALL = 'ticket.view.all',
  TICKET_CREATE = 'ticket.create',
  TICKET_UPDATE = 'ticket.update',
  TICKET_DELETE = 'ticket.delete',
  TICKET_ASSIGN = 'ticket.assign',
  TICKET_CLOSE = 'ticket.close',

  AGENT_MANAGE_ROLES = 'agent.manage.roles',
}

export interface AgentRoleProps {
  role: AgentRoles;
}

export class AgentRole extends ValueObject<AgentRoleProps> {
  private ROLE_PERMISSIONS: Record<AgentRoles, Permission[]> = {
    [AgentRoles.ADMIN]: [...Object.values(Permission)],
    [AgentRoles.SUPERVISOR]: [
      Permission.TICKET_VIEW_ALL,
      Permission.TICKET_CREATE,
      Permission.TICKET_UPDATE,
      Permission.TICKET_DELETE,
      Permission.TICKET_ASSIGN,
      Permission.TICKET_CLOSE,
      Permission.AGENT_MANAGE_ROLES,
    ],
    [AgentRoles.AGENT]: [
      Permission.TICKET_VIEW_ALL,
      Permission.TICKET_CREATE,
      Permission.TICKET_UPDATE,
      Permission.TICKET_DELETE,
      Permission.TICKET_ASSIGN,
      Permission.TICKET_CLOSE,
    ],
    [AgentRoles.VIEWER]: [Permission.TICKET_VIEW_ALL],
  };
  get value(): AgentRoles {
    return this.props.role;
  }

  hasPermission(permission: Permission): boolean {
    const rolePermissions = this.ROLE_PERMISSIONS[this.props.role];
    return rolePermissions.includes(permission);
  }

  static create(role: AgentRoles): AgentRole {
    return new AgentRole({ role });
  }

  static default(): AgentRole {
    return new AgentRole({ role: AgentRoles.AGENT });
  }
}
