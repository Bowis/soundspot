import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, InputType, ObjectType } from "type-graphql";
import { SongCollection } from "./songCollection.schema";

@ObjectType()
export class Category {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @prop({ required: true })
  name: string;

  @Field(() => [SongCollection], { nullable: false })
  @prop({ nullable: false })
  songCollections?: Ref<SongCollection[]>;

  @Field(() => Date)
  @prop({ required: true, default: Date.now })
  createdAt: Date;

  @Field(() => Date)
  @prop({ required: true, default: Date.now })
  updatedAt: Date;
}

export const CategoryModel = getModelForClass<typeof Category>(Category);

@InputType()
export class CreateCategoryInput {
  @Field()
  name: string;
}
