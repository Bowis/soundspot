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
}

export default SongService;
