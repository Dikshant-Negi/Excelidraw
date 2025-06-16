import express from "express";
import { prismaClient } from "@repo/db-common/client";

export const createRoom = async (
  req: express.Request,
  res: express.Response
): Promise<any> => {
    try {
       
        const {name,userId} = req.body

        if(!name || !userId){
            res.status(400).json({success:false,message:"Incomplete credentials"})
        }

        const response = await prismaClient.room.create({data:{
            slug:name,
            adminId:userId
        }})

        res.status(200).json({success:true, message:"room created", data:response})
        
    } catch (error) {
         res.status(500).json({success:true, message:"room creation failed"})
    }
}

export const getChats = async (req:express.Request , res:express.Response) =>{
    try {
        const roomId = Number(req.params.roomId)
        const messages = await prismaClient.chat.findMany({
            where:{
                roomId
            },
            orderBy:{
                id:'desc'
            },
            take:50
        })

        res.status(200).json({success:false,data:messages})
    } catch (error) {
        console.log("error in getchat",error)
        res.status(500).json({success:false,message:error})
    }
}
