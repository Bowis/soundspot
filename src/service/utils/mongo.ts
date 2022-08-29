import mongoose from "mongoose";
import config from "config";

export async function connectToMongo() {
  try {
    await mongoose.connect(config.get("dbUri"));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
