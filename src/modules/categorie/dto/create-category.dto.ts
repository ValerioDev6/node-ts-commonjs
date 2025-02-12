export class CreateCategoryDto {
  constructor(public categoryName: string) {}

  static create(object: { [key: string]: any }): [string?, CreateCategoryDto?] {
    const { categoryName } = object;

    if (!categoryName) throw new Error("CategoryName is required");
    if (typeof categoryName !== "string") throw new Error("CategoryName must be a string");

    return [undefined, new CreateCategoryDto(categoryName)];
  }
}
