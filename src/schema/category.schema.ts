import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, InputType, ObjectType } from "type-graphql";
import { Album } from "./album.schema";

@ObjectType()
export class Category {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @prop({ required: true })
  name: string;

  @Field(() => [Album], { nullable: true })
  @prop({ nullable: true })
  albums?: Ref<Album[]>;

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
