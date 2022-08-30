import { testConn } from "../utils/test/testConn";
import UserService from "../service/user.service";
import { CreateUserInput, LoginInput } from "../schema/user.schema";
import UserResolver from "../resolvers/user.resolver";
import { Connection } from "mongoose";
import mongoose from "mongoose";
import config from "config";
import { Ctx } from "type-graphql";
import { gCall } from "../utils/test/gCall";
import { faker } from "@faker-js/faker";

const registerMutation = `
   mutation Register($input: CreateUserInput!) {
      createUser(
         input: $input
      ) {
         email
      }
   }
`;

let conn: Connection;
beforeAll(async () => {
  await testConn();
  await Promise.all(
    Object.values(mongoose.connection.collections).map(async (collection) => {
      await collection.deleteMany({});
    })
  );
});
afterAll(async () => {
  await mongoose.connection.close();
});

describe("Register user", () => {
  it("create a user", async () => {
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.fullName(),
      avatarUri: faker.internet.avatar(),
    };

    const { data } = await gCall({
      source: registerMutation,
      variableValues: {
        input: user,
      },
    });
    expect(data!.createUser.email).toBe(user.email);
  });
});
