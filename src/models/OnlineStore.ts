import { Schema, model, Document, models } from "mongoose";

const OnlineStoreSchema = new Schema({
    title
    content

    
})

export interface OnlineStoreDocument extends Document {

}

const OnlineStore = model<OnlineStoreDocument>("onlineStore",OnlineStoreSchema);

export default OnlineStore;