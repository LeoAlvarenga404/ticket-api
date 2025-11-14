import { Entity } from './entity';
import { UniqueEntityID } from './unique-entity-id';

export interface TenantScopedProps {
  tenantId: string;
}

export abstract class TenantEntity<
  P extends TenantScopedProps,
> extends Entity<P> {
  get tenantId(): string {
    return this.props.tenantId;
  }

  protected constructor(props: P, id?: UniqueEntityID) {
    super(props, id);
  }
}
