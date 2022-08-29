import { buildSchema } from "type-graphql";
import authChecker from "./service/utils/authChecker";
import { resolvers } from "./resolvers";

export const createSchema = async () => {
  return await buildSchema({
    resolvers,
    authChecker,
  });
};
