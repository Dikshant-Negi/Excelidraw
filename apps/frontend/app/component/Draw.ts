import axios from "axios";
import { backendUrl } from "../config";

type shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerx: number;
      centery: number;
      radius: number;
    };

export async function Draw(canvas: HTMLCanvasElement,roomId:string) {
  const cxt = canvas.getContext("2d");
  if (!cxt) return;

  let startX = 0;
  let startY = 0;
  let clicked = false;
  let existingshape: shape[] = await getMessages(roomId) ;

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
  });

  canvas.addEventListener("mouseup", (e) => {
    if (!clicked) return;
    clicked = false;

    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const width = endX - startX;
    const height = endY - startY;

    existingshape.push({
      type: "rect",
      x: startX,
      y: startY,
      width,
      height,
    });

    clearCanvas(existingshape, canvas, cxt);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      const width = currentX - startX;
      const height = currentY - startY;

      clearCanvas(existingshape, canvas, cxt);
      cxt.strokeStyle = "rgba(255,255,255)";
      cxt.strokeRect(startX, startY, width, height);
    }
  });
}

function clearCanvas(
  existingshape: shape[],
  canvas: HTMLCanvasElement,
  cxt: CanvasRenderingContext2D
) {
  cxt?.clearRect(0, 0, canvas.width, canvas.height);
  existingshape.map((shape) => {
    if (shape.type === "rect") {
      cxt.strokeStyle = "rgba(255,255,255)";
      cxt?.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  });
}

async function getMessages(roomId: string): Promise<shape[]> {
    try {
        const response = await axios.get(backendUrl + `/room/getchats/${roomId}`);
        const messages = response.data.messages;

        if (Array.isArray(messages)) {
            let shapes = messages.flatMap((x: { message: string }) => {
                const messageData = JSON.parse(x.message);
                return Array.isArray(messageData) ? messageData : [messageData];
            });
            return shapes as shape[];
        }

        return [];
    } catch (error) {
        console.log("error in getchat", error);
        return [];
    }
}