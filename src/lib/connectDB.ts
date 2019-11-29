import { connect, set } from "mongoose";
import env from "./env";
require("dotenv").config();

const uri = `${process.env.MONGO_URI}${env === "production" ? "" : `_${env}`}`;

if (env === "development") {
  set("debug", true);
}

const auth = {
  user: process.env.MONGO_ID,
  pass: process.env.MONGO_PASS
};

async function connectDB() {
  await connect(uri, {
    ...auth,
    authSource: "admin",
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

export default connectDB;
