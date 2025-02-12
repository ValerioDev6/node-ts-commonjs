import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RoleType } from "../dto/rol.enum";
import { CustomerEntity } from "../../customer/entities/customer.entity";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  age!: number;
  @Column({ select: false })
  password: string;

  @Column()
  city: string;

  @Column()
  province: string;

  @Column({ type: "enum", enum: RoleType, nullable: false })
  role: RoleType;

  @Column({ type: "boolean", default: false })
  emailValidated: boolean;

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

  @OneToOne(() => CustomerEntity, (customer) => customer.user)
  customer: CustomerEntity;
}
