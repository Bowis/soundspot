  import { DocumentType } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
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
  CreatePlaylistFromSongInput,
  CreatePlaylistInput,
  EditPlaylistInput,
  Playlist,
} from "../schema/playlist.schema";
import { UserModel } from "../schema/user.schema";
import AlbumService from "../service/album.service";
import PlaylistService from "../service/playlist.service";
import SongService from "../service/song.service";
import Context from "../types/context";

import { convertMsToHM } from "../service/utils/helpers";

@Resolver((_of) => Playlist)
export default class PlaylistResolver {
  constructor(
    private playlistService: PlaylistService,
    private songService: SongService
  ) {
    this.playlistService = new PlaylistService();
    this.songService = new SongService();
  }

  @Authorized()
  @Mutation(() => Playlist)
  createPlaylist(
    @Arg("input") input: CreatePlaylistInput,
    @Ctx() context: Context
  ) {
    const { user } = context;
    return this.playlistService.createPlaylist({
      ...input,
      by: user?._id,
      imageUri:
        "https://zerojackerzz.com/wp-content/uploads/2019/10/album-placeholder.png",
    });
  }

  @Authorized()
  @Mutation(() => Playlist)
  editPlaylist(
    @Arg("_id") _id: String,
    @Arg("input") input: EditPlaylistInput
  ) {
    return this.playlistService.editPlaylist(_id, input);
  }

  @Mutation(() => Playlist)
  async createPlaylistFromSong(
    @Arg("input") input: CreatePlaylistFromSongInput,
    @Ctx() context: Context
  ) {
    const { user } = context;
    const { _id } = await this.playlistService.createPlaylist({
      ...input,
      by: user?._id,
      imageUri:
        "https://zerojackerzz.com/wp-content/uploads/2019/10/album-placeholder.png",
    });
    const playlistInput = {
      _id,
      playlistSong: input.playlistSong,
    };
    const playlist = await this.playlistService.addSongToPlaylist(
      playlistInput
    );
    return playlist;
  }

  @Query(() => [Playlist])
  getPlaylistsBySearchTerm(@Arg("searchTerm") searchTerm: string) {
    console.log(searchTerm);

    return this.playlistService.getPlaylistsBySearchTerm(searchTerm);
  }

  @Query(() => [Playlist])
  findAllUserPlaylists(@Ctx() context: Context) {
    const { user } = context;
    return this.playlistService.findAllUserPlaylists(user?._id);
  }

  @Query(() => Playlist)
  findPlaylistById(@Arg("_id") _id: string) {
    return this.playlistService.findPlaylistById(_id);
  }

  @Mutation(() => Playlist)
  async addSongToPlaylist(@Arg("input") input: AddSongToPlaylistInput) {
    return this.playlistService.addSongToPlaylist(input);
  }

  @Mutation(() => Playlist)
  increasePlaylistPlays(@Arg("_id") _id: string) {
    return this.playlistService.increasePlaylistPlays(_id);
  }

  @FieldResolver()
  async by(@Root() playlist: DocumentType<Playlist>): Promise<Playlist["by"]> {
    await UserModel.populate(playlist, { path: "by" });
    return playlist.by;
  }

  @FieldResolver()
  byCurrentUser(@Root() root: DocumentType<Playlist>, @Ctx() context: Context) {
    return root.by?.toString() === context.user!._id ? true : false;
  }

  @FieldResolver()
  async numberOfTracks(@Root() root: DocumentType<Playlist>) {
    const { playlistSongs } = await this.playlistService.findPlaylistById(
      root.id
    );
    return playlistSongs.length;
  }

  @FieldResolver()
  async totalTrackTime(@Root() root: DocumentType<Playlist>) {
    const { playlistSongs } = await this.playlistService.findPlaylistById(
      root.id
    );

    let sum = 0;
    for (const element of playlistSongs) {
      const song = await this.songService.getSongById(element);
      sum += song?.songLength;
    }

    return convertMsToHM(sum);
  }
}
