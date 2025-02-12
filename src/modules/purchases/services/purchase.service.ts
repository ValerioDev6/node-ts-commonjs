// import { PurchaseEntity } from "../entities/purchase.entity";
// import { BaseService } from "../../../config/base.service";
// import { DeleteResult } from "typeorm";

// export class PurchaseService extends BaseService<PurchaseEntity> {
//   constructor() {
//     super(PurchaseEntity);
//   }
//   async findAllPurchase(): Promise<PurchaseEntity[]> {
//     return (await this.execRepository).find();
//   }
//   async findPurchaseById(id: string): Promise<PurchaseEntity | null> {
//     return (await this.execRepository).findOneBy({ id });
//   }
//   async createPurchase(body: any): Promise<PurchaseEntity> {
//     return (await this.execRepository).save(body);
//   }
//   async updatePurchase(id: string, updateDto: any) {
//     return await (await this.execRepository).update(id, updateDto);
//   }
//   async deletePurchase(id: string): Promise<DeleteResult> {
//     return await (await this.execRepository).delete(id);
//   }
// }
