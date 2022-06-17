import AlbumResolver from "./album.resolver";
import AlbumSongResolver from "./albumSong.resolver";
import CategoryResolver from "./category.resolver";
import PlaylistResolver from "./playlist.resolver";
import SongResolver from "./song.resolver";
import UserResolver from "./user.resolver";
import UserLikeResolver from "./userLike.resolver";

export const resolvers = [
  UserResolver,
  SongResolver,
  AlbumResolver,
  AlbumSongResolver,
  PlaylistResolver,
  UserLikeResolver,
  CategoryResolver,
] as const;
