'use client'
import React, { useEffect, useRef } from 'react'
import { Draw } from '../Draw';

function Canvas({roomId}:{roomId:string}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      Draw(canvas,roomId);
    }
  }, [canvasRef]);
  return (
    <div className="flex justify-center flex-col">
      <div className="text-black w-full text-center">Excelidraw</div>
      <canvas
        ref={canvasRef}
        width="1000"
        height="400"
        className="bg-black"
        onMouseEnter={() => {}}
      />
    </div>
  );
}

export default Canvas