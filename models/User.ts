import { model, Schema } from "mongoose";
import * as crpyto from "crypto";

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    set(v: string) {
      const encKey = crpyto.randomBytes(64);
      this.encKey = encKey;

      return crypto.pbkdf2(v, encKey.toString("base64"), 10000, 64, "sha512");
    }
  },
  name: {
    type: String,
    required: true
  },
  no: {
    type: Number,
    required: true
  },
  encKey: {
    type: String
  }
});

const User = model("user", userSchema);
export default User;
