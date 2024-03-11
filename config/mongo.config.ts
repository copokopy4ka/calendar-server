import mongoose from "mongoose";
import _ from "dotenv/config";

const mongoUri = process.env.MONGO_CONNECT_URL;

export const connectMongo = () => {
  if (!mongoUri) {
    console.error("MONGO_CONNECT_URL is not defined");
    return;
  }
  mongoose
    .connect(mongoUri)
    .then(() => console.log("DB OK"))
    .catch((err) => {
      console.error("DB error", err);
    });
};
