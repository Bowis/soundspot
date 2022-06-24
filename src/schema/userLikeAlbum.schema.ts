import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Album } from "./album.schema";
import { Song } from "./song.schema";
import { User } from "./user.schema";

@ObjectType()
export class UserLikeAlbum {
  @Field(() => String)
  _id: string;

  @Field(() => User)
  @prop({ required: true, ref: () => User })
  user: Ref<User>;

  @Field(() => Album)
  @prop({ required: true, ref: () => Song })
  album: Ref<Album>;

  @Field(() => Date)
  @prop({ required: true, default: Date.now })
  createdAt: Date;

  @Field(() => Date)
  @prop({ required: true, default: Date.now })
  updatedAt: Date;
}

export const UserLikeAlbumModel = getModelForClass<typeof UserLikeAlbum>(UserLikeAlbum);

@InputType()
export class CreateUserLikeAlbumInput {
  @Field(() => ID)
  album: ObjectId;
}

@InputType()
export class GetUserLikesAlbumInput {
  @Field()
  user: ObjectId;
}
