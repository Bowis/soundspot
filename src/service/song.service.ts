import {
  CreateSongInput,
  GetSongInput,
  SongModel,
} from "../schema/song.schema";
import { User } from "../schema/user.schema";

class SongService {
  async createSong(input: CreateSongInput & { by: User["_id"] }) {
    return SongModel.create(input);
  }

  async findSingleSong(input: GetSongInput) {
    return SongModel.findOne(input).lean();
  }

  getSongById(_id: string) {
    return SongModel.findById(_id).lean().exec();
  }

  async getSongsBySearchTerm(searchTerm: string) {
    return await SongModel.find({
      title: { $regex: "^" + searchTerm, $options: "i" },
    });
  }

  async increaseSongPlays(_id: string) {
    const song = await SongModel.findById(_id);
    song.plays = song.plays + 1;
    song.save();
    return song;
  }
}

export default SongService;
