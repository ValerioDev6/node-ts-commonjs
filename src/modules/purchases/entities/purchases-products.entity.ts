import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PurchaseEntity } from './purchase.entity';
import { ProductEntity } from '../../product/entities/product.entity';

@Entity({ name: 'purchases_products' })
export class PurchaseProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantityProduct: number;

  @Column()
  totalPrice: number;

  @ManyToOne(() => PurchaseEntity, (purchase) => purchase.purchaseProduct)
  @JoinColumn({ name: 'purchase_id' })
  purchase: PurchaseEntity;

  @ManyToOne(() => ProductEntity, (product) => product.purchaseProduct)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updatedAt: Date;
}
