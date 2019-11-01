import { connect, set } from "mongoose";
import env from "./env";

const uri = `mongodb://localhost/sunrinpay${
  env === "production" ? "" : `_${env}`
}`;

if (env === "development") {
  set("debug", true);
}
async function connectDB() {
  await connect(
    uri,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
}

export default connectDB;
