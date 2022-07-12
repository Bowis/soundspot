import { DocumentType } from "@typegoose/typegoose";
import {
  Arg,
  createUnionType,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Album } from "../schema/album.schema";
import { Playlist } from "../schema/playlist.schema";
import { CreateSearchInput, Search } from "../schema/search.schema";
import { Song } from "../schema/song.schema";
import { User, UserModel } from "../schema/user.schema";
import AlbumService from "../service/album.service";
import PlaylistService from "../service/playlist.service";
import SearchService from "../service/search.service";
import SongService from "../service/song.service";
import Context from "../types/context";

const SearchResultUnion = createUnionType({
  name: "SearchResult",
  types: () => [Song, Album, Playlist] as const,
  resolveType: (value) => {
    if ("albumSongs" in value) {
      return Album;
    }
    if ("playlistSongs" in value) {
      return Playlist;
    }
    return Song;
  },
});

@Resolver((_of) => Search)
export default class SearchResolver {
  constructor(private searchService: SearchService) {
    this.searchService = new SearchService();
  }

  @Query(() => [SearchResultUnion])
  search(@Arg("searchTerm") searchTerm: string) {
    return this.searchService.search(searchTerm);
  }

  @Query(() => [SearchResultUnion])
  getUserSearches(@Ctx() context: Context) {
    const { user } = context;
    if (user) {
      return this.searchService.getUserSearches(user?._id);
    }
  }

  @Mutation(() => Search)
  createSearch(
    @Arg("input") input: CreateSearchInput,
    @Ctx() context: Context
  ) {
    const { user } = context;
    if (user) {
      return this.searchService.createSearch({ ...input, userId: user?._id });
    }
  }

  @Mutation(() => Search)
  async deleteSearch(@Arg("_id") _id: string) {
    console.log(_id);
    return this.searchService.deleteSearch(_id);
  }

  @FieldResolver()
  async userId(
    @Root() search: DocumentType<Search>
  ): Promise<Search["userId"]> {
    await UserModel.populate(search, { path: "userId" });
    return search.userId;
  }
}
