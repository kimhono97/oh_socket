// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { io } from "socket.io-client";

type Data = {
  roomId: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const socket = io("http://localhost:3000");
  socket.on("newRoom", (roomId: string) => {
    res.status(200).json({ roomId: roomId });
  });
  socket.on("onApiMode", () => {
    socket.emit("makeRoom");
  });
  socket.emit("setApiMode");
}
