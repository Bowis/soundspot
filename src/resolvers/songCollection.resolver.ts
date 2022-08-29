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
import { CategoryModel } from "../schema/category.schema";
import {
  AddSongToCollectionInput,
  CreateSongCollectionInput,
  EditCollectionInput,
  SongCollection,
} from "../schema/songCollection.schema";
import { UserModel } from "../schema/user.schema";
import { CreateSongCollectionFromSongInput } from "../schema/userLikeCollection.schema";
import SongService from "../service/song.service";
import SongCollectionService from "../service/songCollection.service";
import { convertMsToHM } from "../service/utils/helpers";
import Context from "../types/context";

@Resolver((_of) => SongCollection)
export default class SongCollectionResolver {
  constructor(
    private songCollectionService: SongCollectionService,
    private songService: SongService
  ) {
    this.songCollectionService = new SongCollectionService();
    this.songService = new SongService();
  }

  @Authorized()
  @Mutation(() => SongCollection)
  createCollection(
    @Arg("input") input: CreateSongCollectionInput,
    @Ctx() context: Context
  ) {
    const { user } = context!;
    return this.songCollectionService.createCollection({
      ...input,
      by: user?._id,
    });
  }

  @Authorized()
  @Mutation(() => SongCollection)
  editCollection(
    @Arg("_id") _id: string,
    @Arg("input") input: EditCollectionInput
  ) {
    return this.songCollectionService.editSongCollection(_id, input);
  }

  @Mutation(() => SongCollection)
  async createPlaylistFromSong(
    @Arg("input") input: CreateSongCollectionFromSongInput,
    @Ctx() context: Context
  ) {
    const { user } = context;
    const { _id } = await this.songCollectionService.createCollection({
      ...input,
      by: user?._id,
      imageUri:
        "https://zerojackerzz.com/wp-content/uploads/2019/10/album-placeholder.png",
    });
    const collectionInput = {
      _id,
      song: input.song,
    };
    const collection = await this.songCollectionService.addSongToCollection(
      collectionInput
    );
    return collection;
  }

  @Query(() => SongCollection)
  getCollectionById(@Arg("_id") _id: string) {
    return this.songCollectionService.findCollectionById(_id);
  }

  @Query(() => [SongCollection])
  getCollectionsBySearchTerm(@Arg("searchTerm") searchTerm: string) {
    return this.songCollectionService.getCollectionsBySearchTerm(searchTerm);
  }

  @Query(() => [SongCollection])
  findAllUserPlaylist(@Ctx() context: Context) {
    const { user } = context;
    return this.songCollectionService.findAllUserPlaylists(user?._id);
  }

  @Mutation(() => SongCollection)
  async addSongToCollection(@Arg("input") input: AddSongToCollectionInput) {
    return this.songCollectionService.addSongToCollection(input);
  }

  @Mutation(() => SongCollection)
  increaseCollectionPlays(@Arg("_id") _id: string) {
    return this.songCollectionService.increaseCollectionPlays(_id);
  }

  @FieldResolver()
  async category(
    @Root() songCollection: DocumentType<SongCollection>
  ): Promise<SongCollection["category"]> {
    await CategoryModel.populate(songCollection, { path: "category" });
    return songCollection.category;
  }

  @FieldResolver()
  async by(
    @Root() songCollection: DocumentType<SongCollection>
  ): Promise<SongCollection["by"]> {
    await UserModel.populate(songCollection, { path: "by" });
    return songCollection.by;
  }

  byCurrentUser(
    @Root() root: DocumentType<SongCollection>,
    @Ctx() context: Context
  ) {
    return root.by?.toString() === context.user!._id ? true : false;
  }

  @FieldResolver()
  async numberOfTracks(@Root() root: DocumentType<SongCollection>) {
    const { songs } = await this.songCollectionService.findCollectionById(
      root.id
    );
    return songs.length;
  }

  @FieldResolver()
  async totalTrackTime(@Root() root: DocumentType<SongCollection>) {
    const { songs } = await this.songCollectionService.findCollectionById(
      root.id
    );

    let sum = 0;
    for (const element of songs) {
      const song = await this.songService.getSongById(element);
      sum += song?.songLength;
    }

    return convertMsToHM(sum);
  }

  @FieldResolver()
  async liked(
    @Root() root: DocumentType<SongCollection>,
    @Ctx() context: Context
  ) {
    //  const input = {
    //    song: root.id,
    //    user: context.user!._id,
    //  };
    //  const userLike = await this.userLikeAlbumService.findUserLikeAlbum(input);
    //  if (userLike === null) {
    //    return false;
    //  } else {
    //    return true;
    //  }
  }
}
