import { CreateSearchInput, SearchModel } from "../schema/search.schema";
import { User } from "../schema/user.schema";
import AlbumService from "./album.service";
import PlaylistService from "./playlist.service";
import SongService from "./song.service";
import { Result } from "../schema/search.schema";
import mongoose from "mongoose";

class SearchService {
  constructor(
    private songService: SongService,
    private albumService: AlbumService,
    private playlistService: PlaylistService
  ) {
    this.songService = new SongService();
    this.albumService = new AlbumService();
    this.playlistService = new PlaylistService();
  }

  async search(searchTerm: string) {
    const songs = await this.songService.getSongsBySearchTerm(searchTerm);
    const albums = await this.albumService.getAlbumsBySearchTerm(searchTerm);
    const playlists = await this.playlistService.getPlaylistsBySearchTerm(
      searchTerm
    );
    return [...songs, ...albums, ...playlists];
  }

  async createSearch(input: CreateSearchInput & { userId: User["_id"] }) {
    switch (input.selectedResultType) {
      case Result.Album:
        const album = await this.albumService.findAlbumById(
          input.selectedResult
        );
        if (album) input.selectedResultType = Result.Album;
      case Result.Song:
        const song = await this.songService.getSongById(input.selectedResult);
        if (song) input.selectedResultType = Result.Song;
      case Result.Playlist:
        const playlist = await this.playlistService.findPlaylistById(
          input.selectedResult
        );
        if (playlist) input.selectedResultType = Result.Playlist;
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
      console.log(search);
      switch (search.selectedResultType) {
        case Result.Album:
          let album = await this.albumService.findAlbumById(
            search.selectedResult
          );
          if (album) {
            album.searchResultId = search._id;
            results.push(album);
          }
        case Result.Song:
          let song = await this.songService.getSongById(search.selectedResult);
          if (song) {
            song.searchResultId = search._id;
            results.push(song);
          }
        case Result.Playlist:
          let playlist = await this.playlistService.findPlaylistById(
            search.selectedResult
          );
          if (playlist) {
            playlist.searchResultId = search._id;
            results.push(playlist);
          }
      }
    }
    return results;
  }
}

export default SearchService;
