import express from "express"
import jwt from "jsonwebtoken"
import Mongoose from "mongoose"

exports.sigin = (req : express.Request , res : express.Response) =>{
    try{
        const {email , password } = req.body
        if(!email || !password){
            res.status(400).json({success:false , message:"Incomplete credentials"})
        }
        
            

    }catch(err){

    }
}


