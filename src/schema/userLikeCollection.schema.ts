import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Album } from "./album.schema";
import { SongCollection } from "./songCollection.schema";
import { User } from "./user.schema";

@ObjectType()
export class UserLikeCollection {
  @Field(() => String)
  _id: string;

  @Field(() => User)
  @prop({ required: true, ref: () => User })
  user: Ref<User>;

  @Field(() => Album)
  @prop({ required: true, ref: () => SongCollection })
  collection: Ref<SongCollection>;

  @Field(() => Date)
  @prop({ required: true, default: Date.now })
  createdAt: Date;

  @Field(() => Date)
  @prop({ required: true, default: Date.now })
  updatedAt: Date;
}

export const UserLikeCollectionModel =
  getModelForClass<typeof UserLikeCollection>(UserLikeCollection);

@InputType()
export class CreateUserLikeCollectionInput {
  @Field(() => ID)
  collection: ObjectId;
}

@InputType()
export class CreateSongCollectionFromSongInput {
  @Field()
  title: string;

  @Field(() => PlaylistSongInput)
  playlistSong!: PlaylistSongInput;
}

@InputType()
export class GetUserLikesCollectionInput {
  @Field()
  user: ObjectId;
}
