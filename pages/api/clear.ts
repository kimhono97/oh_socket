// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { io } from "socket.io-client";

type Data = {
  result: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const socket = io("http://localhost:3000");
  socket.on("onApiMode", () => {
    socket.emit("clearRooms");
    res.status(200).json({ result: true });
  });
  socket.emit("setApiMode");
}
