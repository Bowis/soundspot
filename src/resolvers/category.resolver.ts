import { Arg, Mutation, Resolver } from "type-graphql";
import { Category, CreateCategoryInput } from "../schema/category.schema";
import CategoryService from "../service/category.service";

@Resolver((_of) => Category)
export default class CategoryResolver {
  constructor(private categoryService: CategoryService) {
    this.categoryService = new CategoryService();
  }

  @Mutation(() => Category)
  createCategory(@Arg("input") input: CreateCategoryInput) {
    return this.categoryService.createCategory(input);
  }
}
