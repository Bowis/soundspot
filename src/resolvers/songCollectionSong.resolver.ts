import { DocumentType } from "@typegoose/typegoose";
import { FieldResolver, Resolver, Root } from "type-graphql";
import { SongModel } from "../schema/song.schema";
import { CollectionSong } from "../schema/songCollection.schema";
import SongCollectionService from "../service/songCollection.service";

@Resolver((_of) => CollectionSong)
export default class CollectionSongResolver {
  constructor(private songCollectionService: SongCollectionService) {
    this.songCollectionService = new SongCollectionService();
  }

  @FieldResolver()
  async song(@Root() root: DocumentType<CollectionSong>) {
    const song = await SongModel.findById(root.id).exec();
    return song;
  }
}
