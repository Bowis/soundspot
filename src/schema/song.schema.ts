import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, InputType, ObjectType } from "type-graphql";
import { User } from "./user.schema";

@ObjectType()
export class Song {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @prop({ required: true })
  title: string;

  @Field(() => Number)
  @prop({ required: true, default: 0 })
  likes: number;

  @Field(() => Number)
  @prop({ required: true, default: 0 })
  plays: number;

  @Field(() => String)
  @prop({ required: true })
  imageUri: string;

  @Field(() => String)
  @prop({ required: true })
  soundUri: string;

  @Field(() => User)
  @prop({ required: true, ref: () => User })
  by: Ref<User>;

  @Field(() => Boolean)
  liked: boolean;

  @Field(() => Date)
  @prop({ required: true, default: Date.now })
  createdAt: Date;

  @Field(() => Date)
  @prop({ required: true, default: Date.now })
  updatedAt: Date;
}

export const SongModel = getModelForClass<typeof Song>(Song);

@InputType()
export class CreateSongInput {
  @Field()
  title: string;

  @Field()
  imageUri: string;
}

@InputType()
export class GetSongInput {
  @Field()
  _id: string;
}
