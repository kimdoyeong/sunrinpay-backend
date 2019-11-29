import * as jwt from "jsonwebtoken";
import OnlinePayment, {OnlinePaymentDocument} from "../models/OnlinePayment"
import { TokenValidError } from './error'
import createError from './error/createError';
import { StoreToken } from "./storeToken";

export interface OnlineStoreToken{
    userid: string;
    product : string;
    paymentid : string;
    type : string;
}

export function onlineStoreTokenGenerate(onlineStoreData : OnlineStoreToken) {
    const { userid, product , paymentid} = onlineStoreData;
    const data: OnlineStoreToken = {
        userid,
        product,
        paymentid,
        type:'onlinestore'
    };
    return jwt.sign(data,process.env.TOKEN_KEY || "tokenkey" , {expiresIn :'7d'});
}

export async function onlineStoreTokenVerify(token :string) {
    const data: OnlineStoreToken = jwt.decode(token) as OnlineStoreToken;

    if(data.type !== 'onlinestore') throw TokenValidError;
    const onlineStoreData = await OnlinePayment.findById(data.paymentid);

    if(!onlineStoreData) throw TokenValidError;
    try {
        jwt.verify(token,process.env.TOKEN_KEY);
    } catch (e) {
        if (e.name === "TokenExpiredError") {
            throw createError("토큰이 만료되었습니다.", 403);
          } else if (e.name === "JsonWebTokenError" || e.name === "NotBeforeError") {
            throw TokenValidError;
          }
          throw e;
    }
    return onlineStoreData;
}