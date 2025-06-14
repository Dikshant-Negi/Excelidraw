import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 9002 });

wss.on("connection", (ws, req) => {
  // Extract and parse the cookie header manually
  const cookieHeader = req.headers.cookie;
  const cookies: { [key: string]: string } = {};

  if (cookieHeader) {
    cookieHeader.split(";").forEach(cookie => {
      const [name, ...rest] = cookie.trim().split("=");
      if (name !== undefined && name !== "") {
        cookies[name] = decodeURIComponent(rest.join("="));
      }
    });
    
  }else{
    wss.close()
    return
  }

  const accessToken = cookies["accesstoken"]; 
  console.log("Access token:", accessToken);

  ws.on("message", (data) => {
    ws.send("hi");
  });
});
