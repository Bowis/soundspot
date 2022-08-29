import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Song } from "./song.schema";
import { User } from "./user.schema";

@ObjectType()
export class UserLike {
  @Field(() => String)
  _id: string;

  @Field(() => User)
  @prop({ required: true, ref: () => User })
  user: Ref<User>;

  @Field(() => Song)
  @prop({ required: true, ref: () => Song })
  song: Ref<Song>;

  @Field(() => Date)
  @prop({ required: true, default: Date.now })
  createdAt: Date;

  @Field(() => Date)
  @prop({ required: true, default: Date.now })
  updatedAt: Date;
}

export const UserLikeModel = getModelForClass<typeof UserLike>(UserLike);

@InputType()
export class CreateUserLikeInput {
  @Field(() => ID)
  song: ObjectId;
}

@InputType()
export class GetUserLikesInput {
  @Field(() => ID)
  user: ObjectId;
}
