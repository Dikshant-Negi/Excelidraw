
import React from "react";
import Canvas from "../../component/board/Canvas";

async function page({ params }: { params: { roomId: string } }) {
  const roomId = (await params).roomId
  console.log("roomId",roomId)
  return <Canvas roomId={roomId}/>
}

export default page;
