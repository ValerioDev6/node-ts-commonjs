import { DeleteResult, Repository } from "typeorm";
import { CategoryEntity } from "../entities/category.entity";
import { getRepositoryFactory } from "../../../config";
import { PaginationDto } from "../../../shared/dtos/pagination.dto";
import { CustomError } from "../../../shared/errors/custom-error";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { UpdateCategoryDto } from "../dto/update-category.dto";

export class CategoryService {
  private readonly categoryRepository: Repository<CategoryEntity>;

  constructor() {
    this.categoryRepository = getRepositoryFactory(CategoryEntity);
  }

  async findAllCategoriesPagination(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [category, total] = await this.categoryRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: { categoryName: "ASC" },
      });

      return {
        page,
        limit,
        total,
        next: `${process.env.URL_ENV}/api/category?page=${page + 1}&limit=${limit}`,
        prev: page - 1 > 0 ? `${process.env.URL_ENV}/api/category?page=${page - 1}&limit=${limit}` : null,
        categories: category.map((category) => ({
          ...category,
        })),
      };
    } catch (error) {
      console.error({ error });
      throw new CustomError(500, "Error al obtener category");
    }
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    const categoryExists = await this.categoryRepository.findOne({
      where: { categoryName: createCategoryDto.categoryName },
    });

    if (categoryExists) throw CustomError.badRequest("Category already exists");

    try {
      const categoryData = { ...createCategoryDto };

      const category = this.categoryRepository.create(categoryData);
      await this.categoryRepository.save(category);
      return category;
    } catch (error) {
      throw CustomError.internalServe(`Internal Error ${error}`);
    }
  }

  async getCategoryById(id: string): Promise<CategoryEntity | null> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
      });

      if (!category) throw CustomError.notFound(`Category not found with id: ${id}`);

      return category;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServe(`Error getting category: ${error}`);
    }
  }

  async updateCategoryDto(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
    const category = await this.getCategoryById(id);

    if (!category) {
      throw CustomError.notFound("Category not found");
    }
    try {
      await this.categoryRepository.update(id, updateCategoryDto);
      const updatedCategory = await this.getCategoryById(id);

      if (!updatedCategory) {
        throw CustomError.notFound("Updated category not found");
      }

      return updatedCategory;
    } catch (error) {
      throw CustomError.internalServe(`Error updating category: ${error}`);
    }
  }
  async deleteCategory(id: string): Promise<DeleteResult> {
    const category = await this.getCategoryById(id);

    if (!category) {
      throw CustomError.notFound(`Category with id ${id} not found`);
    }

    try {
      return await this.categoryRepository.delete(id);
    } catch (error) {
      throw CustomError.internalServe(`Internal Error ${error}`);
    }
  }
}
