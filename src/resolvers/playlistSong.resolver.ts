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
import { PlaylistSong } from "../schema/playlist.schema";
import { SongModel } from "../schema/song.schema";
import PlaylistService from "../service/playlist.service";

@Resolver((_of) => PlaylistSong)
export default class PlaylistSongResolver {
  constructor(private playlistService: PlaylistService) {
    this.playlistService = new PlaylistService();
  }

  @FieldResolver()
  async song(@Root() root: DocumentType<PlaylistSong>) {
    const song = await SongModel.findById(root.id).exec();
    return song;
  }
}
