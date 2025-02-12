import { Router } from 'express';
import { CustomerService } from './services/customer.service';
import { CustomerController } from './controllers/customer.controller';

export class CustomerRouter {
  static get routes(): Router {
    const router = Router();
    const customerService = new CustomerService();
    const controller = new CustomerController(customerService);

    router.get('/', (req, res) => {
      controller.getCustomers(req, res);
    });

    router.post('/', (req, res) => {
      controller.createCustomer(req, res);
    });

    return router;
  }
}
