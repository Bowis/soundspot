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
import { SongModel } from "../schema/song.schema";
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

  @Authorized()
  @Query(() => [UserLike])
  findAllUserLikes(@Ctx() context: Context) {
    const user = context.user!._id;
    console.log('hit')
    return this.userLikeService.findAllUserLikes(user);
  }

  @Authorized()
  @Mutation(() => UserLike)
  removeUserLike(
    @Arg("input") input: CreateUserLikeInput,
    @Ctx() context: Context
  ) {
    const user = context.user!;
    return this.userLikeService.removeUserLike({ ...input, user: user?._id });
  }

  @FieldResolver()
  async song(
    @Root() userLike: DocumentType<UserLike>
  ): Promise<UserLike["song"]> {
    await SongModel.populate(userLike, { path: "song" });
    return userLike.song;
  }

  @FieldResolver()
  async user(
    @Root() userLike: DocumentType<UserLike>
  ): Promise<UserLike["user"]> {
    await UserModel.populate(userLike, { path: "user" });
    return userLike.user;
  }
}
