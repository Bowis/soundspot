import { DocumentType } from "@typegoose/typegoose";
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Album, CreateAlbumInput, GetAlbumInput } from "../schema/album.schema";
import { CategoryModel } from "../schema/category.schema";
import { UserModel } from "../schema/user.schema";
import AlbumService from "../service/album.service";
import UserLikeAlbumService from "../service/userLikeAlbum.service";
import Context from "../types/context";

@Resolver((_of) => Album)
export default class AlbumResolver {
  constructor(
    private albumService: AlbumService,
    private userLikeAlbumService: UserLikeAlbumService
  ) {
    this.albumService = new AlbumService();
    this.userLikeAlbumService = new UserLikeAlbumService();
  }

  @Authorized()
  @Mutation(() => Album)
  createAlbum(@Arg("input") input: CreateAlbumInput, @Ctx() context: Context) {
    const user = context.user!;
    return this.albumService.createAlbum({ ...input, by: user?._id });
  }

  @Query(() => Album)
  album(@Arg("_id") _id: string) {
    return this.albumService.findAlbumById(_id);
  }

  @FieldResolver()
  async category(
    @Root() album: DocumentType<Album>
  ): Promise<Album["category"]> {
    await CategoryModel.populate(album, { path: "category" });
    return album.category;
  }

  @FieldResolver()
  async by(@Root() album: DocumentType<Album>): Promise<Album["by"]> {
    await UserModel.populate(album, { path: "by" });
    return album.by;
  }

  @FieldResolver()
  async liked(@Root() root: DocumentType<Album>, @Ctx() context: Context) {
    const input = {
      song: root.id,
      user: context.user!._id,
    };
    const userLike = await this.userLikeAlbumService.findUserLikeAlbum(input);
    if (userLike === null) {
      return false;
    } else {
      return true;
    }
  }
}
