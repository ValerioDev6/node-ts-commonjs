import { Request, Response } from 'express';
import { CustomError } from '../../../shared/errors/custom-error';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';

export class CustomerController {
  constructor(public readonly customerService: CustomerService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Internal server error' });
  };

  getCustomers = (req: Request, res: Response) => {
    this.customerService
      .findAllCustomer()
      .then((customer) => res.json(customer))
      .catch((error) => this.handleError(error, res));
  };
  createCustomer = (req: Request, res: Response) => {
    const [error, customerRegisterDto] = CreateCustomerDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.customerService
      .createCustomer(customerRegisterDto!)
      .then((user) => res.status(201).json(user))
      .catch((error) => this.handleError(error, res));
  };
}
