import { WebSocketServer, WebSocket } from "ws";
import { checkUser } from "./utility/common";
import { parse } from "url";
import {  IncomingMessage } from "http";
import { manager } from "./store/UserManager";

const wss = new WebSocketServer({ port: 9002 });



wss.on("connection", (ws:WebSocket, req : IncomingMessage) => {
  const parsedUrl = parse(req.url || "", true)
  const token = parsedUrl.query.token as string
  let checkuser: any = null;

    checkuser = checkUser(token);
    if (checkuser === null) {
      wss.close();
      return;
    }

   manager.insertUser(checkuser.id , ws )

    ws.on("message", (data) => {
      const newdata = JSON.parse(data as unknown as string);
      if (newdata.type === "join_room") {
        manager.joinRoom(newdata,ws)
      }

      if (newdata.type === "leave_room") {
        manager.leaveRoom(newdata,ws)
      }

      if (newdata.type === "chat") {
        const roomId = newdata.roomId;
        const message = newdata.message;
        manager.chat(roomId,message)
      }
      ws.send("hi");
    });
  
});
