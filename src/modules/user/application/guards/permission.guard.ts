import { Either, left, right } from '@/core/either';
import { Agent } from '../../domain/entities/agent';
import { Permission } from '../../../user/domain/value-objects/agent-role';
import { UnauthorizedError } from '@/core/errors/unauthorized.error';

export class PermissionGuard {
  static check(
    agent: Agent,
    permission: Permission,
  ): Either<UnauthorizedError, void> {
    
    if (!agent.hasPermission(permission)) {
      return left(new UnauthorizedError(`Missing permission: ${permission}`));
    }

    return right(undefined);
  }
}
