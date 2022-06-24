
import {
  AddSongToPlaylistInput,
  CreatePlaylistInput,
  PlaylistModel,
} from "../schema/playlist.schema";
import { SongModel } from "../schema/song.schema";
import { User } from "../schema/user.schema";

class PlaylistService {
  async createPlaylist(input: CreatePlaylistInput & { by: User["_id"] }) {
    return PlaylistModel.create(input);
  }

  async addSongToPlaylist(input: AddSongToPlaylistInput) {
    if (input.playlistSong._id.match(/^[0-9a-fA-F]{24}$/)) {
      const song = await SongModel.findById(input.playlistSong._id);
      if (!song) throw new Error("song not found");
    } else {
      throw new Error("No objectId");
    }

    return PlaylistModel.updateOne(
      { _id: input._id },
      { $push: { playlistSongs: input.playlistSong } }
    );
  }
}

export default PlaylistService;
