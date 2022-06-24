import { DocumentType } from "@typegoose/typegoose";
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Album, AlbumSong, CreateAlbumInput, GetAlbumInput } from "../schema/album.schema";
import { SongModel } from "../schema/song.schema";
import { UserModel } from "../schema/user.schema";
import AlbumService from "../service/album.service";
import Context from "../types/context";

@Resolver((_of) => AlbumSong)
export default class AlbumSongResolver {
  constructor(private albumService: AlbumService) {
    this.albumService = new AlbumService();
  }

  @FieldResolver()
  async song(@Root() root: DocumentType<AlbumSong>) {
    const song = await SongModel.findById(root.id).exec();
    return song;
  }
}
