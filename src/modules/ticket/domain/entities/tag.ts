import { TenantEntity } from '@/core/entities/tenant-entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface TagProps {
  tenantId: string;
  name: string;
  description?: string;
  color: string;
  createdAt: Date;
}

export class Tag extends TenantEntity<TagProps> {
  get name() {
    return this.props.name;
  }
  get color() {
    return this.props.color;
  }

  static create(props: TagProps, id?: UniqueEntityID) {
    return new Tag(props, id);
  }
}
