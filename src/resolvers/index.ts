import AlbumResolver from "./album.resolver";
import AlbumSongResolver from "./albumSong.resolver";
import CategoryResolver from "./category.resolver";
import PlaylistResolver from "./playlist.resolver";
import PlaylistSongResolver from "./playlistSong.resolver";
import SearchResolver from "./search.resolver";
import SongResolver from "./song.resolver";
import UserResolver from "./user.resolver";
import UserLikeResolver from "./userLike.resolver";
import UserLikeAlbumResolver from "./userLikeAlbum.resolver";

export const resolvers = [
  UserResolver,
  SongResolver,
  AlbumResolver,
  AlbumSongResolver,
  PlaylistResolver,
  PlaylistSongResolver,
  UserLikeResolver,
  CategoryResolver,
  UserLikeAlbumResolver,
  SearchResolver,
] as const;
