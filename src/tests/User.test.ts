import { testConn } from "../utils/test/testConn";
import UserService from "../service/user.service";
import { CreateUserInput, LoginInput } from "../schema/user.schema";
import UserResolver from "../resolvers/user.resolver";
import { Connection } from "mongoose";
import mongoose from "mongoose";
import config from "config";
import { Ctx } from "type-graphql";
import { gCall } from "../utils/test/gCall";

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

const registerMutation = `
   mutation Register($input: CreateUserInput!) {
      createUser(
         input: $input
      ) {
         email
      }
   }
`;

describe("Register user", () => {
  it("create a user", async () => {
    const { data } = await gCall({
      source: registerMutation,
      variableValues: {
        input: {
          email: "test@test.com",
          password: "312311",
          name: "Test User",
          avatarUri: "123",
        },
      },
    });
    expect(data!.createUser.email).toBe("test@test.com");
  });
});
