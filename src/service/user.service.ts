import { ApolloError } from "apollo-server";
import { LoginInput, UserModel } from "../schema/user.schema";
import Context from "../types/context";
import bcrypt from "bcrypt";
import { signJwt } from "./utils/jwt";

export default class UserService {
  async createUser(input: any) {
    return UserModel.create(input);
  }

  async login(input: LoginInput, context: Context) {
    const e = "Invalid email or password";

    const user = await UserModel.find().findByEmail(input.email).lean();

    if (!user) {
      throw new ApolloError("Invalid email or password");
    }

    const passwordIsValid = await bcrypt.compare(input.password, user.password);

    if (!passwordIsValid) {
      throw new ApolloError(e);
    }

    const token = signJwt(user);
    console.log(context);
    const test = context.res.cookie("accessToken", token, {
      maxAge: 3.154e10,
      httpOnly: true,
      domain: "localhost",
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    console.log(token);
    return token;
  }
}
