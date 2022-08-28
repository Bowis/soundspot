import { ObjectId } from "mongoose";
import { SongModel } from "../schema/song.schema";
import {
  AddSongToCollectionInput,
  CreateSongCollectionInput,
  EditCollectionInput,
  SongCollectionModel,
} from "../schema/songCollection.schema";

class SongCollectionService {
  async createCollection(
    input: CreateSongCollectionInput & { by: User["_id"] }
  ) {
    for await (const { _id } of input.songs) {
      if (_id.match(/^[0-9a-fA-F]{24}$/)) {
        const song = await SongModel.findById(_id);
        if (!song) throw new Error("song not found");
      } else {
        throw new Error("No objectId");
      }
    }

    return SongCollectionModel.create(input);
  }

  async getCollectionsBySearchTerm(searchTerm: string) {
    return await SongCollectionModel.find({
      title: { $regex: "^" + searchTerm, $options: "i" },
    });
  }

  async findCollectionById(_id: string) {
    return await SongCollectionModel.findById(_id);
  }

  async editSongCollection(_id: String, input: EditCollectionInput) {
    return SongCollectionModel.findOneAndUpdate({ _id }, input);
  }

  async addSongToCollection(input: AddSongToCollectionInput) {
    if (input.song._id.match(/^[0-9a-fA-F]{24}$/)) {
      const song = await SongModel.findById(input.song._id);
      if (!song) throw new Error("song not found");
      console.log("not found");
    } else {
      console.log("not found");

      throw new Error("No objectId");
    }

    return await SongCollectionModel.findOneAndUpdate(
      { _id: input._id },
      { $push: { playlistSongs: input.song } }
    );
  }

  async findAllUserPlaylists(by: ObjectId) {
    return SongCollectionModel.find({
      by,
      isAlbum: false,
    });
  }

  async increaseCollectionPlays(_id: string) {
    const collection = await SongCollectionModel.findById(_id);
    if (collection) {
      collection.plays = collection.plays + 1;
      collection.save();
      return collection;
    } else {
      return null;
    }
  }
}

export default SongCollectionService;
