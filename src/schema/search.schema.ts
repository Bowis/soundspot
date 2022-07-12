import { getModelForClass, index, prop, Ref } from "@typegoose/typegoose";
import { Field, InputType, ObjectType } from "type-graphql";
import { User } from "./user.schema";
import { registerEnumType } from "type-graphql";

export enum Result {
  Song = "Song",
  Album = "Album",
  Playlist = "Playlist",
}

registerEnumType(Result, {
  name: "Result",
});

@ObjectType()
export class Search {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @prop({ required: true })
  selectedResult: string;

  @Field(() => Result)
  @prop({ required: true })
  selectedResultType: Result;

  @Field(() => User)
  @prop({ required: true, ref: () => User })
  userId: Ref<User>;

  @Field(() => Date)
  @prop({ required: true, default: Date.now })
  createdAt: Date;

  @Field(() => Date)
  @prop({ required: true, default: Date.now })
  updatedAt: Date;
}

export const SearchModel = getModelForClass<typeof Search>(Search);

@InputType()
export class CreateSearchInput {
  @Field()
  selectedResult: string;

  @Field()
  selectedResultType: string;
}
