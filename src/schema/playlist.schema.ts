import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, InputType, ObjectType } from "type-graphql";
import { Song } from "./song.schema";
import { User } from "./user.schema";

@ObjectType()
export class PlaylistSong {
  @Field(() => String)
  _id: string;

  @Field(() => Song, { nullable: true })
  @prop({ type: () => Song, ref: () => Song, nullable: true })
  song: Ref<Song>;
}

@ObjectType()
export class Playlist {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @prop({ required: true })
  title: string;

  @Field(() => Number)
  @prop({ required: true, default: 0 })
  likes: number;

  @Field(() => [PlaylistSong])
  @prop({ type: PlaylistSong })
  playlistSongs!: Partial<PlaylistSong>[];

  @Field(() => String)
  @prop({ required: true })
  imageUri: string;

  @Field(() => User)
  @prop({ required: true, ref: () => User })
  by: Ref<User>;

  @Field(() => Date)
  @prop({ required: true, default: Date.now })
  createdAt: Date;

  @Field(() => Date)
  @prop({ required: true, default: Date.now })
  updatedAt: Date;
}

export const PlaylistModel = getModelForClass<typeof Playlist>(Playlist);

@InputType()
export class PlaylistSongInput implements Partial<PlaylistSong> {
  @Field()
  _id!: string;
}

@InputType()
export class CreatePlaylistInput {
  @Field()
  title: string;

  @Field()
  imageUri: string;
}

@InputType()
export class AddSongToPlaylistInput {
  @Field()
  _id: string;

  @Field(() => PlaylistSongInput)
  playlistSong!: PlaylistSongInput;
}

@InputType()
export class GetPlaylistInput {
  @Field()
  _id: string;
}
