import { NotFoundError } from "../entities/domain-error";

export class AgentNotFoundError extends NotFoundError {
  readonly code = 'AGENT_NOT_FOUND'
  
  constructor() {
    super('Agent not found.');
  }
}
