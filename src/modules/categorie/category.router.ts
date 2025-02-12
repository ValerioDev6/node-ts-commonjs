import { Router } from 'express';
import { CategoryService } from './services/categoria.service';
import { CategoryController } from './controller/category.controller';

export class CategoryRouter {
  static get routes(): Router {
    const router = Router();
    const categoryService = new CategoryService();
    const controller = new CategoryController(categoryService);

    router.get('/', (req, res) => {
      controller.getCategoriesPagination(req, res);
    });

    router.post('/', (req, res) => {
      controller.createCategory(req, res);
    });

    router.get('/:id', controller.getCategoryById);

    router.put('/:id', (req, res) => {
      controller.updateCategory(req, res);
    });

    router.delete('/:id', controller.deleteCategory);

    return router;
  }
}
