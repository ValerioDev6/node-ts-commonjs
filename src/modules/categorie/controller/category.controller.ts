import e, { Request, Response } from 'express';
import { CustomError } from '../../../shared/errors/custom-error';
import { CategoryService } from '../services/categoria.service';
import { PaginationDto } from '../../../shared/dtos/pagination.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

export class CategoryController {
  constructor(public readonly categoryService: CategoryService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Internal server error' });
  };

  getCategoriesPagination = (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.categoryService
      .findAllCategoriesPagination(paginationDto!)
      .then((category) => res.json(category))
      .catch((error) => this.handleError(error, res));
  };

  createCategory = (req: Request, res: Response) => {
    const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.categoryService
      .createCategory(createCategoryDto!)
      .then((category) => res.status(201).json(category))
      .catch((error) => this.handleError(error, res));
  };

  updateCategory = (req: Request, res: Response) => {
    const id = req.params.id;
    const [error, updateCategoryDto] = UpdateCategoryDto.create({
      ...req.body,
    });
    if (error) return res.status(400).json({ error });
    this.categoryService
      .updateCategoryDto(id, updateCategoryDto!)
      .then((category) => res.json(category))
      .catch((error) => res.status(400).json({ error }));
  };

  getCategoryById = (req: Request, res: Response) => {
    const { id } = req.params;

    this.categoryService
      .getCategoryById(id)
      .then((category) => res.json(category))
      .catch((error) => this.handleError(error, res));
  };

  deleteCategory = (req: Request, res: Response) => {
    const { id } = req.params;
    this.categoryService
      .deleteCategory(id)
      .then((category) => res.json(category))
      .catch((error) => this.handleError(error, res));
  };
}
