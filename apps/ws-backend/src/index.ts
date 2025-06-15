import { WebSocketServer, WebSocket } from "ws";
import { checkUser } from "./utility/common";

const wss = new WebSocketServer({ port: 9002 });

// unoptimal way
interface types {
  userId: string;
  room: string[];
  ws: WebSocket;
}

let users: types[] = [];

wss.on("connection", (ws, req) => {
  // Extract and parse the cookie header manually
  const cookieHeader = req.headers.cookie;
  const cookies: { [key: string]: string } = {};
  let checkuser: any = null;
  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const [name, ...rest] = cookie.trim().split("=");
      if (name !== undefined && name !== "") {
        cookies[name] = decodeURIComponent(rest.join("="));
      }
    });
    const token = cookies["accesstoken"] as string;
    checkuser = checkUser(token);
    if (checkuser === null) {
      wss.close();
      return;
    }

    users.push({
      userId: checkuser.id,
      room: [],
      ws,
    });

    ws.on("message", (data) => {
      const newdata = JSON.parse(data as unknown as string);
      if (newdata.type === "join_room") {
        const user = users.find((x) => x.ws === ws);
        user?.room.push(newdata.roomId);
      }

      if (newdata.type === "leave_room") {
        const user = users.find((x) => x.ws === ws);
        if (user) {
          user.room = user.room.filter((x) => x === newdata.roomId);
        }
      }

      if (newdata.type === "chat") {
        const roomId = newdata.roomId;
        const message = newdata.message;
        users.forEach((user) => {
          if (user.room.includes(newdata.roomId)) {
            user.ws.send(
              JSON.stringify({
                type: "chat",
                message: message,
                roomId,
              })
            );
          }
        });
      }
      ws.send("hi");
    });
  } else {
    wss.close();
    return;
  }
});
