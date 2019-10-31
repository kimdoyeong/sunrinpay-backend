import { connect } from "mongoose";
import env from "./env";

const uri = `mongodb://localhost/sunrinpay${
  env === "production" ? "" : `_${env}`
}`;
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
