import express from "express";
import { createRoom,getChats } from "../controller/room";
import { authentication } from "../middleware/authMiddleware";

const router = express.Router()

router.post('/create-room',authentication,createRoom)
router.get('/getchats/:roomId',getChats)

export default router