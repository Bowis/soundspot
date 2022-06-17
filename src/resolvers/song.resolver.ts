import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { CreateSongInput, GetSongInput, Song } from "../schema/song.schema";
import SongService from "../service/song.service";
import Context from "../types/context";

@Resolver()
export default class SongResolver {
  constructor(private songService: SongService) {
    this.songService = new SongService();
  }

  @Authorized()
  @Mutation(() => Song)
  createSong(@Arg("input") input: CreateSongInput, @Ctx() context: Context) {
    const user = context.user!;
    return this.songService.createSong({ ...input, by: user?._id });
  }

  @Query(() => Song)
  song(@Arg("input") input: GetSongInput) {
    return this.songService.findSingleSong(input);
  }
}
