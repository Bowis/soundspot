import {
  AlbumModel,
  CreateAlbumInput,
  GetAlbumInput,
} from "../schema/album.schema";
import { SongModel } from "../schema/song.schema";
import { User } from "../schema/user.schema";

class AlbumService {
  async createAlbum(input: CreateAlbumInput & { by: User["_id"] }) {
    for await (const { _id } of input.albumSongs) {
      if (_id.match(/^[0-9a-fA-F]{24}$/)) {
        const song = await SongModel.findById(_id);
        if (!song) throw new Error("song not found");
      } else {
        throw new Error("No objectId");
      }
    }

    return AlbumModel.create(input);
  }

  async getAlbumsBySearchTerm(searchTerm: string) {
    return await AlbumModel.find({
      title: { $regex: "^" + searchTerm, $options: "i" },
    });
  }

  async findAlbumById(_id: string) {
    return await AlbumModel.findById(_id);
  }
}

export default AlbumService;
