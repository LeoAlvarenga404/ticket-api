import { Either, left, right } from '@/core/either';
import { AgentRole, AgentRoles } from '../../domain/value-objects/agent-role';
import { UserNotFoundError } from '@/core/errors/user-not-found.error';
import { UserAlreadyExistsError } from '@/core/errors/user-already-exists.error';
import { User } from '../../domain/entities/user';
import { UsersRepository } from '../../domain/repositories/users.repository';
import { DomainEventDispatcher } from '@/core/events/domain-event-dispatcher';

export interface PromoteUserToAgentRequest {
  userId: string;
  tenantId: string;
  roleName: AgentRoles;
}

export type PromoteUserToAgentResponse = Either<
  UserNotFoundError | UserAlreadyExistsError,
  {
    user: User;
  }
>;

export class PromoteUserToAgentUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private eventDispatcher: DomainEventDispatcher,
  ) {}

  async execute({
    userId,
    tenantId,
    roleName,
  }: PromoteUserToAgentRequest): Promise<PromoteUserToAgentResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new UserNotFoundError());
    }

    if (user.isAgent) {
      return left(new UserAlreadyExistsError());
    }

    const role = AgentRole.create(roleName);

    const result = user.promoteToAgent(tenantId, role);

    if (result.isLeft()) {
      return left(result.value);
    }

    await this.usersRepository.save(user);

    await this.eventDispatcher.dispatchEventsForAggregate(user);

    return right({ user });
  }
}
