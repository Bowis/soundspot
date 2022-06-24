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
import SongService from "../service/song.service";
import UserLikeService from "../service/userLike.service";
import Context from "../types/context";

@Resolver((_of) => Song)
export default class SongResolver {
  constructor(
    private songService: SongService,
    private userLikeService: UserLikeService
  ) {
    this.songService = new SongService();
    this.userLikeService = new UserLikeService();
  }

  @Authorized()
  @Mutation(() => Song)
  createSong(@Arg("input") input: CreateSongInput, @Ctx() context: Context) {
    const user = context.user!;
    return this.songService.createSong({ ...input, by: user?._id });
  }

  @Mutation(() => Song)
  increaseSongPlays(@Arg("_id") _id: string) {
    return this.songService.increaseSongPlays(_id);
  }

  @Query(() => Song)
  song(@Arg("_id") _id: string) {
    return this.songService.getSongById(_id);
  }

  @FieldResolver()
  async by(@Root() song: DocumentType<Song>): Promise<Song["by"]> {
    await UserModel.populate(song, { path: "by" });
    return song.by;
  }

  @FieldResolver()
  async liked(@Root() root: DocumentType<Song>, @Ctx() context: Context) {
    const input = {
      song: root.id,
      user: context.user!._id,
    };
    const userLike = await this.userLikeService.findUserLike(input);
    if (userLike === null) {
      return false;
    } else {
      return true;
    }
  }
}
