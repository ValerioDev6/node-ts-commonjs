import { Repository } from "typeorm";
import { CustomerEntity } from "../entities/customer.entity";
import { getRepositoryFactory } from "../../../config";
import { CustomError } from "../../../shared/errors/custom-error";
import { CreateCustomerDto } from "../dto/create-customer.dto";
import { UserEntity } from "../../user/entities/user.entity";

export class CustomerService {
  private readonly customerRepository: Repository<CustomerEntity>;
  private readonly userRepository: Repository<UserEntity>;

  constructor() {
    this.customerRepository = getRepositoryFactory(CustomerEntity);
    this.userRepository = getRepositoryFactory(UserEntity);
  }

  async findAllCustomer(): Promise<CustomerEntity[]> {
    try {
      const customer = await this.customerRepository.find({
        order: { id: "ASC" },
      });

      if (!customer) throw CustomError.notFound("Customer not found");

      return customer;
    } catch (error) {
      throw new CustomError(500, "Error al obtener customers");
    }
  }

  async createCustomer(customerRegisterDto: CreateCustomerDto): Promise<CustomerEntity> {
    try {
      const user = await this.userRepository.findOneBy({
        id: customerRegisterDto.user,
      });
      if (!user) {
        throw CustomError.notFound("User not found");
      }

      const customerData = {
        address: customerRegisterDto.address,
        dni: customerRegisterDto.dni,
        user: user,
        
      };

      const customer = this.customerRepository.create(customerData);
      await this.customerRepository.save(customer);
      return customer;
    } catch (error) {
      throw CustomError.internalServe(`Internal error: ${error}`);
    }
  }
}
