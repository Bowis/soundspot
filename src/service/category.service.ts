import { CategoryModel, CreateCategoryInput } from "../schema/category.schema";

class CategoryService {
  async createCategory(input: CreateCategoryInput) {
    return CategoryModel.create(input);
  }
}

export default CategoryService;
