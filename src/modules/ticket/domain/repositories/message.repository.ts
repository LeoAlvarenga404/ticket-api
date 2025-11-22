import { Message } from '../entities/message';

export abstract class MessageRepository {
  abstract save(message: Message): Promise<void>;
  abstract findByTicketId(tickedId: string): Promise<Message[]>;
  abstract findById(id: string): Promise<Message | null>;
}
