import { Schema, model, Document, models } from "mongoose";
import { randomBytes, pbkdf2Sync } from "crypto";
import * as uniqueValidator from "mongoose-unique-validator";
import { RequiredError, UserAlreadyExist } from "../lib/error";

const storeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    set(v: string) {
      const encKey = randomBytes(64);
      this.encKey = encKey.toString("base64");

      return pbkdf2Sync(
        v,
        encKey.toString("base64"),
        10000,
        64,
        "sha512"
      ).toString("base64");
    }
  },
  encKey: {
    type: String
  },
  accreditation: {
    type: Boolean,
    default: false
  }
});

export interface StoreDocument extends Document {
  name: string;
  description: string;
  id: string;
  password: string;
  encKey: string;
}

storeSchema.pre("save", function(next) {
  models["store"].findOne({ id: this.id }, function(err, user) {
    console.log(user);
    if (err) next(err);
    if (user) next(UserAlreadyExist);
    else next();
  });
});
storeSchema.pre("validate", function(next) {
  try {
    const doc = this as StoreDocument;
    if (!doc.name) throw RequiredError("이름");
    if (!doc.description) throw RequiredError("설명");
    if (!doc.id) throw RequiredError("아이디");
    if (!doc.password) throw RequiredError("비밀번호");
    next();
  } catch (e) {
    next(e);
  }
});
storeSchema.methods.comparePassword = function(userPw: string) {
  const { password, encKey } = this as StoreDocument;
  const userPwEnc = pbkdf2Sync(userPw, encKey, 10000, 64, "sha512").toString(
    "base64"
  );

  return password === userPwEnc;
};

const Store = model<StoreDocument>("store", storeSchema);

export default Store;
