import { DocumentType } from "@typegoose/typegoose";
import { Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql";
import { Album, CreateAlbumInput, GetAlbumInput } from "../schema/album.schema";
import { UserModel } from "../schema/user.schema";
import AlbumService from "../service/album.service";
import Context from "../types/context";

@Resolver((_of) => Album)
export default class AlbumResolver {
  constructor(private albumService: AlbumService) {
    this.albumService = new AlbumService();
  }

  @Authorized()
  @Mutation(() => Album)
  createAlbum(@Arg("input") input: CreateAlbumInput, @Ctx() context: Context) {
    const user = context.user!;
    return this.albumService.createAlbum({ ...input, by: user?._id });
  }

  @Query(() => Album)
  album(@Arg("input") input: GetAlbumInput) {
    return this.albumService.findSingleAlbum(input);
  }

}
