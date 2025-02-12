import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";
import { PurchaseEntity } from "../../purchases/entities/purchase.entity";

@Entity({ name: "customer" })
export class CustomerEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  address: string;

  @Column()
  dni: number;

  @OneToOne(() => UserEntity, (user) => user.customer)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @OneToMany(() => PurchaseEntity, (purchase) => purchase.customer)
  purchases: PurchaseEntity[];

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
