import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, InputType, ObjectType } from "type-graphql";
import { Category } from "./category.schema";
import { Song } from "./song.schema";
import { User } from "./user.schema";

@ObjectType()
export class AlbumSong {
  @Field(() => String)
  _id: string;

  @Field(() => Song, { nullable: true })
  @prop({ type: () => Song, ref: () => Song, nullable: true })
  song: Ref<Song>;
}

@ObjectType()
export class Album {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @prop({ required: true })
  title: string;

  @Field(() => Number)
  @prop({ required: true, default: 0 })
  likes: number;

  @Field(() => [AlbumSong])
  @prop({ type: AlbumSong })
  albumSongs!: Partial<AlbumSong>[];

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

  @Field(() => String)
  searchResultId: string;

  @Field(() => Date)
  @prop({ required: true, default: Date.now })
  createdAt: Date;

  @Field(() => Date)
  @prop({ required: true, default: Date.now })
  updatedAt: Date;
}

export const AlbumModel = getModelForClass<typeof Album>(Album);

@InputType()
export class AlbumSongInput implements Partial<AlbumSong> {
  @Field()
  _id!: string;
}

@InputType()
export class CreateAlbumInput {
  @Field()
  title: string;

  @Field()
  imageUri: string;

  @Field(() => [AlbumSongInput])
  albumSongs!: AlbumSongInput[];
}

@InputType()
export class GetAlbumInput {
  @Field()
  _id: string;
}
