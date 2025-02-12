import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProductEntity } from "../../product/entities/product.entity";

@Entity({ name: "category" })
export class CategoryEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  categoryName: string;

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];

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
