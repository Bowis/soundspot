import mongoose from "mongoose";
import config from "config";

export async function testConn() {
  return mongoose.connect(config.get("dbTestUri"));
}
