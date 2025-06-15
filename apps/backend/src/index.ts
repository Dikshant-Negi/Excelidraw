import express from "express";
import auth from "./routers/auth"; 
import cookieParser from "cookie-parser";
import cors from "cors"
import room from "./routers/room"
const app = express();

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true
}))
app.use(cookieParser())
app.use(express.json());
app.use("/auth", auth);
app.use('/room',room);
app.listen(9001, () => {
  console.log("Server running on port 9001");
});

