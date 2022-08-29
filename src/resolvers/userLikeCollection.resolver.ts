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
import { SongCollectionModel } from "../schema/songCollection.schema";
import { UserModel } from "../schema/user.schema";
import {
  CreateUserLikeCollectionInput,
  UserLikeCollection,
} from "../schema/userLikeCollection.schema";
import UserLikeCollectionService from "../service/userLikeCollection.service";
import Context from "../types/context";

@Resolver((_of) => UserLikeCollection)
export default class UserLikeCollectionResolver {
  constructor(private userLikeCollectionService: UserLikeCollectionService) {
    this.userLikeCollectionService = new UserLikeCollectionService();
  }

  @Authorized()
  @Mutation(() => UserLikeCollection)
  createUserLikeAlbum(
    @Arg("input") input: CreateUserLikeCollectionInput,
    @Ctx() context: Context
  ) {
    const user = context.user!;
    return this.userLikeCollectionService.createUserLikeAlbum({
      ...input,
      user: user?._id,
    });
  }

  @Authorized()
  @Mutation(() => UserLikeCollection)
  removeUserLikeAlbum(
    @Arg("input") input: CreateUserLikeCollectionInput,
    @Ctx() context: Context
  ) {
    const user = context.user!;
    return this.userLikeCollectionService.removeUserLikeCollection({
      ...input,
      user: user?._id,
    });
  }

  @FieldResolver()
  async songCollection(
    @Root() userLike: DocumentType<UserLikeCollection>
  ): Promise<UserLikeCollection["songCollection"]> {
    await SongCollectionModel.populate(userLike, { path: "songCollection" });
    return userLike.songCollection;
  }

  @FieldResolver()
  async user(
    @Root() userLike: DocumentType<UserLikeCollection>
  ): Promise<UserLikeCollection["user"]> {
    await UserModel.populate(userLike, { path: "user" });
    return userLike.user;
  }
}
