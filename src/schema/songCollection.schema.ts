import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, InputType, ObjectType } from "type-graphql";
import { Category } from "./category.schema";
import { Song } from "./song.schema";
import { User } from "./user.schema";

@ObjectType()
export class CollectionSong {
  @Field(() => String)
  _id: string;

  @Field(() => Song, { nullable: true })
  @prop({ type: () => Song, ref: () => Song, nullable: true })
  song: Ref<Song>;
}

@ObjectType()
export class SongCollection {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @prop({ required: true })
  title: string;

  @Field(() => Number)
  @prop({ required: true, default: 0 })
  likes: number;

  @Field(() => [CollectionSong])
  @prop({ type: CollectionSong })
  songs!: Partial<CollectionSong>[];

  @Field(() => Category)
  @prop({ required: true, ref: Category })
  category: Ref<Category>;

  @Field(() => String)
  @prop({ required: true })
  imageUri: string;

  @Field(() => User)
  @prop({ required: true, ref: () => User })
  by: Ref<User>;

  @Field(() => Boolean)
  liked: boolean;

  @Field(() => Boolean)
  isAlbum: boolean;

  @Field(() => Number)
  numberOfTracks: number;

  @Field(() => String)
  totalTrackTime: string;

  @Field(() => Boolean)
  byCurrentUser: boolean;

  @Field(() => String)
  searchResultId: string;

  @Field(() => Date)
  @prop({ required: true, default: Date.now })
  createdAt: Date;

  @Field(() => Date)
  @prop({ required: true, default: Date.now })
  updatedAt: Date;
}

export const SongCollectionModel =
  getModelForClass<typeof SongCollection>(SongCollection);

@InputType()
export class CollectionSongInput implements Partial<CollectionSong> {
  @Field()
  _id!: string;
}

@InputType()
export class CreateSongCollectionInput {
  @Field()
  title: string;

  @Field()
  imageUri: string;

  @Field()
  isAlbum: boolean;

  @Field(() => [CollectionSongInput])
  songs!: CollectionSongInput[];
}

@InputType()
export class EditCollectionInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  imageUri: string;
}

@InputType()
export class CreateSongCollectionFromInput {
  @Field()
  title: string;

  @Field(() => CollectionSong)
  song!: CollectionSongInput;
}

@InputType()
export class AddSongToCollectionInput {
  @Field()
  _id: string;

  @Field(() => CollectionSongInput)
  song!: CollectionSongInput;
}

@InputType()
export class GetAlbumInput {
  @Field()
  _id: string;
}
