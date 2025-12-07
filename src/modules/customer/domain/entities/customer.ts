import { TenantEntity } from '@/core/entities/tenant-entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface CustomerProps {
  tenantId: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Customer extends TenantEntity<CustomerProps> {
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
  get updatedAt() {
    return this.props.updatedAt;
  }

  changeName(name: string) {
    this.props.name = name;
    this.touch();
  }

  changeEmail(email: string) {
    this.props.email = email;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(_props: CustomerProps, id?: UniqueEntityID) {
    const customer = new Customer({ ..._props }, id);
    return customer;
  }
}
