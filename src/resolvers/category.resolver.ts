import { DocumentType } from "@typegoose/typegoose";
import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Album, AlbumModel } from "../schema/album.schema";
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

  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    return this.categoryService.categories();
  }

  @FieldResolver()
  async albums(@Root() root: DocumentType<Category>): Promise<Album[]> {
    const albums = await AlbumModel.find({
      albumCategory: root.id,
    }).exec();
    return albums;
  }
}
