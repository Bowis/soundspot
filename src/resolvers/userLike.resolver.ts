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
import { CreateSongInput, GetSongInput, Song } from "../schema/song.schema";
import { UserModel } from "../schema/user.schema";
import { CreateUserLikeInput, UserLike } from "../schema/userLike.schema";
import SongService from "../service/song.service";
import UserLikeService from "../service/userLike.service";
import Context from "../types/context";

@Resolver((_of) => UserLike)
export default class UserLikeResolver {
  constructor(private userLikeService: UserLikeService) {
    this.userLikeService = new UserLikeService();
  }

  @Authorized()
  @Mutation(() => UserLike)
  createUserLike(
    @Arg("input") input: CreateUserLikeInput,
    @Ctx() context: Context
  ) {
    const user = context.user!;
    return this.userLikeService.createUserLike({ ...input, user: user?._id });
  }

  @FieldResolver()
  async user(
    @Root() userLike: DocumentType<UserLike>
  ): Promise<UserLike["user"]> {
    await UserModel.populate(userLike, { path: "user" });
    return userLike.user;
  }
}
