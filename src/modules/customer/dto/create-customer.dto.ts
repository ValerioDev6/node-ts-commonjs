import { registerCustomerSchema } from './customer.zod';

export class CreateCustomerDto {
  constructor(
    public address: string,
    public dni: number,
    public user: string,
  ) {}
  static create(object: { [key: string]: any }): [string?, CreateCustomerDto?] {
    const result = registerCustomerSchema.safeParse(object);

    if (!result.success) {
      return [result.error.errors[0].message];
    }

    return [undefined, new CreateCustomerDto(result.data.address, result.data.dni, result.data.user)];
  }
}
