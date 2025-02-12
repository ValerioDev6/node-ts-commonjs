export class UpdateCategoryDto {
  constructor(public categoryName?: string) {}
  static create(object: { [key: string]: any }): [string?, UpdateCategoryDto?] {
    const { categoryName } = object;

    if (!categoryName) {
      return [undefined, new UpdateCategoryDto()];
    }
    if (typeof categoryName !== 'string') {
      return ['CategoryName must be a string', undefined];
    }

    return [undefined, new UpdateCategoryDto(categoryName)];
  }
}
