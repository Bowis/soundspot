import CategoryResolver from "./category.resolver";
import SearchResolver from "./search.resolver";
import SongResolver from "./song.resolver";
import UserResolver from "./user.resolver";
import UserLikeResolver from "./userLike.resolver";
import UserLikeCollectionResolver from "./userLikeCollection.resolver";

export const resolvers = [
  UserResolver,
  SongResolver,
  UserLikeResolver,
  CategoryResolver,
  UserLikeCollectionResolver,
  SearchResolver,
] as const;
