import { WebSocket } from "ws";
interface UserType {
  userId: string;
  room: string[];
  ws: WebSocket;
}

class UserManager {
  private users: UserType[];
  private static instance: UserManager;

  private constructor() {
    this.users = [];
  }

  public static getInstance(): UserManager {
    if (!UserManager.instance) {
      UserManager.instance = new UserManager();
    }
    return UserManager.instance;
  }

  public insertUser(userId: string, ws: WebSocket) {
    this.users.push({
      userId,
      room: [],
      ws,
    });
  }

  public joinRoom(roomId: string, ws: WebSocket) {
    const user = this.users.find((x) => x.ws === ws);
    if (user && !user.room.includes(roomId)) {
      user.room.push(roomId);
    }
  }

  public leaveRoom(roomId: string, ws: WebSocket) {
    const user = this.users.find((x) => x.ws === ws);
    if (user) {
      user.room = user.room.filter((r) => r !== roomId);
    }
  }

  public chat(roomId: string, message: string) {
    this.users.forEach((user) => {
      if (user.room.includes(roomId)) {
        user.ws.send(
          JSON.stringify({
            type: "chat",
            message,
            roomId,
          })
        );
      }
    });
  }

  public removeUser(ws: WebSocket) {
    this.users = this.users.filter((u) => u.ws !== ws);
  }
}

export const manager = UserManager.getInstance();
