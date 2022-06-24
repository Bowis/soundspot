import { CategoryModel, CreateCategoryInput } from "../schema/category.schema";

class CategoryService {
  async createCategory(input: CreateCategoryInput) {
    return await CategoryModel.create(input);
  }

  async categories() {
    return await CategoryModel.find().exec();
  }
}

export default CategoryService;
