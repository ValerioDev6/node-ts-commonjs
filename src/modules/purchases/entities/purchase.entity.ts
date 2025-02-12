import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PurchaseProductEntity } from "./purchases-products.entity";
import { CustomerEntity } from "../../customer/entities/customer.entity";

@Entity({ name: "purchase" })
export class PurchaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  status: string;

  @Column()
  paymentMethod!: string;

  @ManyToOne(() => CustomerEntity, (customer) => customer.purchases)
  @JoinColumn({ name: "customer_id" })
  customer: CustomerEntity;

  @OneToMany(() => PurchaseProductEntity, (purchaseProduct) => purchaseProduct.purchase)
  purchaseProduct: PurchaseProductEntity[];

  @CreateDateColumn({
    type: "timestamp",
    name: "created_at",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    name: "updated_at",
  })
  updatedAt: Date;
}
