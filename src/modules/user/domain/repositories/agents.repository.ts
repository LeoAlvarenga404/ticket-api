import { Agent } from '../entities/agent';

export abstract class AgentsRepository {
  abstract save(user: Agent): Promise<void>;
  abstract findById(agentId: string): Promise<Agent | null>;
}
