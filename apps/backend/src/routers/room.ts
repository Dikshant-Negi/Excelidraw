import express from "express";
import { createRoom } from "../controller/room";
import { authentication } from "../middleware/authMiddleware";

const router = express.Router()

router.post('/create-room',authentication,createRoom)

export default router