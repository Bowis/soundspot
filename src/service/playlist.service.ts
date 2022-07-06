import { ObjectId } from "mongoose";
import {
  AddSongToPlaylistInput,
  CreatePlaylistInput,
  EditPlaylistInput,
  PlaylistModel,
} from "../schema/playlist.schema";
import { SongModel } from "../schema/song.schema";
import { User } from "../schema/user.schema";

class PlaylistService {
  async createPlaylist(
    input: CreatePlaylistInput & { by: User["_id"] } & {
      imagUri: "https://zerojackerzz.com/wp-content/uploads/2019/10/album-placeholder.png";
    }
  ) {
    return PlaylistModel.create(input);
  }

  async editPlaylist(_id: String, input: EditPlaylistInput) {
    return PlaylistModel.findOneAndUpdate({_id}, input);
  }

  async addSongToPlaylist(input: AddSongToPlaylistInput) {
    if (input.playlistSong._id.match(/^[0-9a-fA-F]{24}$/)) {
      const song = await SongModel.findById(input.playlistSong._id);
      if (!song) throw new Error("song not found");
    } else {
      throw new Error("No objectId");
    }

    return await PlaylistModel.findOneAndUpdate(
      { _id: input._id },
      { $push: { playlistSongs: input.playlistSong } }
    );
  }

  async findAllUserPlaylists(by: ObjectId) {
    return PlaylistModel.find({
      by,
    });
  }

  async findPlaylistById(_id: string) {
    return PlaylistModel.findById(_id);
  }

  async increasePlaylistPlays(_id: string) {
    const playlist = await PlaylistModel.findById(_id);
    playlist.plays = playlist.plays + 1;
    playlist.save();
    return playlist;
  }
}

export default PlaylistService;
