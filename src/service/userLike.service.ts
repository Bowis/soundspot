import { ObjectId } from "mongoose";
import { User } from "../schema/user.schema";
import {
  UserLikeModel,
  CreateUserLikeInput,
  GetUserLikesInput,
} from "../schema/userLike.schema";

class UserLikeService {
  async createUserLike(input: CreateUserLikeInput & { user: User["_id"] }) {
    return UserLikeModel.create(input);
  }

  async removeUserLike(input: CreateUserLikeInput & { user: User["_id"] }) {
    return UserLikeModel.findOneAndDelete(input);
  }

  async findUserLike(input: any) {
    const test = await UserLikeModel.findOne(input).lean();
    return test;
  }

  async findAllUserLikes(user: any) {
    return await UserLikeModel.find({
      user,
    });
  }
}

export default UserLikeService;
