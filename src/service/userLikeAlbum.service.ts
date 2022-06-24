import { ObjectId } from "mongoose";
import { AlbumModel } from "../schema/album.schema";
import { User } from "../schema/user.schema";
import {
  UserLikeModel,
  CreateUserLikeInput,
  GetUserLikesInput,
} from "../schema/userLike.schema";
import { UserLikeAlbumModel } from "../schema/userLikeAlbum.schema";

class UserLikeAlbumService {
  async createUserLikeAlbum(
    input: CreateUserLikeInput & { user: User["_id"] }
  ) {
    const userLikeAlbum = await UserLikeAlbumModel.create(input);
    const albumId = input.album;

    const album = await AlbumModel.findById(albumId);
    album.likes = album.likes + 1;
    album.save();
    return userLikeAlbum;
  }

  async removeUserLikeAlbum(
    input: CreateUserLikeInput & { user: User["_id"] }
  ) {
    const userLikeAlbum = UserLikeAlbumModel.findOneAndDelete(input);

    const albumId = input.album;

    const album = await AlbumModel.findById(albumId);
    album.likes = album.likes - 1;
    album.save();
    return userLikeAlbum;
  }

  async findUserLikeAlbum(input: any) {
    const test = await UserLikeAlbumModel.findOne(input).lean();
    return test;
  }

  async findAllUserLikesAlbum(user: any) {
    return await UserLikeAlbumModel.find({
      user,
    });
  }
}

export default UserLikeAlbumService;
