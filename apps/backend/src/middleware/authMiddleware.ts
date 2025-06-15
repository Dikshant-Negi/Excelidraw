import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {accessToken} from "@repo/backend-common/config"

export  const authentication = (
  req: Request,
  res: Response,
  next: NextFunction
):any =>{
  try {   
    const { accesstoken } = req.cookies;
    if (!accesstoken) {
      return res
        .status(400)
        .json({ success: false, message: "Access token required" });
    }

    const accessTokenSecret = accessToken;

    const verified = jwt.verify(accesstoken, accessTokenSecret as string);

    if(verified){
        // @ts-ignore
        req.user = verified.id
        next()
    }
   
  } catch (error) {
    res.status(403).json({success:false , message:"Unauthorized access"})
  }
}
