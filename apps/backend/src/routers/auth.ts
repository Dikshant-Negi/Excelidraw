// routes/auth.ts   (really .js if you want pure CommonJS)
import express from "express"
import {signin, signup} from "../controller/auth"

const router = express.Router();

router.post("/signin", signin);
router.post('/signup',signup)

export default router         // CommonJS export
