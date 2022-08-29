import { CreateSearchInput, SearchModel } from "../schema/search.schema";
import { User } from "../schema/user.schema";
import SongService from "./song.service";
import { Result } from "../schema/search.schema";
import SongCollectionService from "./songCollection.service";

class SearchService {
  constructor(
    private songService: SongService,
    private songCollectionService: SongCollectionService
  ) {
    this.songService = new SongService();
    this.songCollectionService = new SongCollectionService();
  }

  async search(searchTerm: string) {
    const songs = await this.songService.getSongsBySearchTerm(searchTerm);
    const collections =
      await this.songCollectionService.getCollectionsBySearchTerm(searchTerm);
    return [...songs, ...collections];
  }

  async createSearch(input: CreateSearchInput & { userId: User["_id"] }) {
    switch (input.selectedResultType) {
      case Result.SongCollection:
        const collection = await this.songCollectionService.findCollectionById(
          input.selectedResult
        );
        if (collection) input.selectedResultType = Result.SongCollection;
      case Result.Song:
        const song = await this.songService.getSongById(input.selectedResult);
        if (song) input.selectedResultType = Result.Song;
    }
    return SearchModel.create(input);
  }

  async deleteSearch(_id: string) {
    return SearchModel.findOneAndDelete({ _id });
  }

  async getUserSearches(userId: User["_id"] | undefined) {
    const searches = await SearchModel.find({ userId });
    let results: any[] = [];
    for (let search of searches) {
      switch (search.selectedResultType) {
        case Result.SongCollection:
          let collection = await this.songCollectionService.findCollectionById(
            search.selectedResult
          );

          if (collection) {
            collection.searchResultId = search._id;
            results.push(collection);
          }
        case Result.Song:
          let song = await this.songService.getSongById(search.selectedResult);
          if (song) {
            song.searchResultId = search._id;
            results.push(song);
          }
      }
    }
    return results;
  }
}

export default SearchService;
