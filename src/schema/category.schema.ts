import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class Category {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  name: string;

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
