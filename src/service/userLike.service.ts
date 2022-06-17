import { User } from "../schema/user.schema";
import { UserLikeModel, CreateUserLikeInput } from "../schema/userLike.schema";

class UserLikeService {
  async createUserLike(input: CreateUserLikeInput & { user: User["_id"] }) {
    return UserLikeModel.create(input);
  }
}

export default UserLikeService;
