import { Router } from "express";
import wrapAsync from "../../lib/wrapAsync";
import createError from "../../lib/error/createError";
import User, { UserDocument } from "../../models/User";
import { authorized, adminAuthorized } from "../../lib/middlewares/auth";
import OnlineStore from "../../models/Product";
import {uploadImage} from '../../lib/ImageUpload'
import Product from "../../models/Product";

const router = Router();

router.post('/input',adminAuthorized,wrapAsync(async(req,res)=> {
    const { title , content , cost , stock , img } = req.body;

    const product = new Product({
        title,content,cost,stock,img : ""
    })

    await product.save();
    
    uploadImage(img, product._id);

    await Product.findOneAndUpdate({_id: product._id}, {$set:{img: process.env.HTTP_URI || "localhost"}});

    res.status(200).json({state:true})

}));

export default router;
