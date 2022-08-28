import { SongCollectionModel } from "../schema/songCollection.schema";
import { User } from "../schema/user.schema";
import {
  CreateUserLikeCollectionInput,
  UserLikeCollectionModel,
} from "../schema/userLikeCollection.schema";

class UserLikeCollectionService {
  async createUserLikeAlbum(
    input: CreateUserLikeCollectionInput & { user: User["_id"] }
  ) {
    const userLikeAlbum = await UserLikeCollectionModel.create(input);
    const collectionId = input.collection;

    const collection = await SongCollectionModel.findById(collectionId);
    if (collection) {
      collection.likes = collection.likes + 1;
      collection.save();
      return userLikeAlbum;
    }
  }

  async removeUserLikeCollection(
    input: CreateUserLikeCollectionInput & { user: User["_id"] }
  ) {
    const userLikeCollection = await UserLikeCollectionModel.findOneAndDelete(
      input
    );

    const collectionId = input.collection;

    const collection = await SongCollectionModel.findById(collectionId);
    if (collection) {
      collection.likes = collection.likes - 1;
      collection.save();
      return userLikeCollection;
    }
  }

  async findUserLikeCollection(input: any) {
    const test = await UserLikeCollectionModel.findOne(input).lean();
    return test;
  }

  async finderAllUserLikeCollections(user: any) {
    return await UserLikeCollectionModel.find({
      user,
    });
  }
}

export default UserLikeCollectionService;
