"use client";
import React, { useEffect, useState } from "react";
import Canvas from "../../component/board/Canvas";
import { wsurl } from "@/app/config";

async function page({ params }: { params: { roomId: string } }) {
  const roomId = (await params).roomId;
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    const ws = new WebSocket(wsurl);
    ws.onopen = () => {
      setSocket(ws);
      ws.send(JSON.stringify({
        type:'join_room',
        roomId
      }))
    };
  }, []);
  console.log("roomId", roomId);
  if (!socket) return <div className="text-black">connecting to socket </div>;
  return <Canvas roomId={roomId} socket={socket}/>;
}

export default page;
