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
import {
  AddSongToPlaylistInput,
  CreatePlaylistInput,
  Playlist,
} from "../schema/playlist.schema";
import { UserModel } from "../schema/user.schema";
import AlbumService from "../service/album.service";
import PlaylistService from "../service/playlist.service";
import Context from "../types/context";

@Resolver((_of) => Playlist)
export default class PlaylistResolver {
  constructor(private playlistService: PlaylistService) {
    this.playlistService = new PlaylistService();
  }

  @Authorized()
  @Mutation(() => Playlist)
  createPlaylist(
    @Arg("input") input: CreatePlaylistInput,
    @Ctx() context: Context
  ) {
    // const user = context.user!;
    const { user } = context;
    return this.playlistService.createPlaylist({ ...input, by: user?._id });
  }

  @Query(() => [Playlist])
  findAllUserPlaylists(@Ctx() context: Context) {
    const {user} = context;
    return this.playlistService.findAllUserPlaylists(user?._id)
  }

  @Authorized()
  @Mutation(() => Playlist)
  addSongToPlaylist(@Arg("input") input: AddSongToPlaylistInput) {
    return this.playlistService.addSongToPlaylist(input);
  }

  @FieldResolver()
  async by(@Root() playlist: DocumentType<Playlist>): Promise<Playlist["by"]> {
    await UserModel.populate(playlist, { path: "by" });
    return playlist.by;
  }
}
