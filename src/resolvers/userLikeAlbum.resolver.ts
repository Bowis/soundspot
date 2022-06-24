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
import { AlbumModel } from "../schema/album.schema";
import { SongModel } from "../schema/song.schema";
import { UserModel } from "../schema/user.schema";
import { CreateUserLikeInput, UserLike } from "../schema/userLike.schema";
import {
  CreateUserLikeAlbumInput,
  UserLikeAlbum,
} from "../schema/userLikeAlbum.schema";
import SongService from "../service/song.service";
import UserLikeService from "../service/userLike.service";
import UserLikeAlbumService from "../service/userLikeAlbum.service";
import Context from "../types/context";

@Resolver((_of) => UserLikeAlbum)
export default class UserLikeAlbumResolver {
  constructor(private userLikeAlbumService: UserLikeAlbumService) {
    this.userLikeAlbumService = new UserLikeAlbumService();
  }

  @Authorized()
  @Mutation(() => UserLikeAlbum)
  createUserLikeAlbum(
    @Arg("input") input: CreateUserLikeAlbumInput,
    @Ctx() context: Context
  ) {
    const user = context.user!;
    return this.userLikeAlbumService.createUserLikeAlbum({
      ...input,
      user: user?._id,
    });
  }

  @Authorized()
  @Mutation(() => UserLikeAlbum)
  removeUserLikeAlbum(
    @Arg("input") input: CreateUserLikeAlbumInput,
    @Ctx() context: Context
  ) {
    const user = context.user!;
    return this.userLikeAlbumService.removeUserLikeAlbum({
      ...input,
      user: user?._id,
    });
  }

  @FieldResolver()
  async album(
    @Root() userLike: DocumentType<UserLikeAlbum>
  ): Promise<UserLikeAlbum["album"]> {
    await AlbumModel.populate(userLike, { path: "album" });
    return userLike.album;
  }

  @FieldResolver()
  async user(
    @Root() userLike: DocumentType<UserLikeAlbum>
  ): Promise<UserLikeAlbum["user"]> {
    await UserModel.populate(userLike, { path: "user" });
    return userLike.user;
  }
}
