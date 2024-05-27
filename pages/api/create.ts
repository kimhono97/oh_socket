// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  roomId: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const ws = new WebSocket("ws://localhost:3001");
  ws.addEventListener("message", rawData => {
    const data = JSON.parse(rawData.toString());
    if (data.type == "newRoom") {
      res.status(200).json({ roomId: data.roomId });
    } else {
      res.status(400).json({ roomId: "" });
    }
    ws.close();
  });
  ws.addEventListener("open", () => {
    ws.send(JSON.stringify({
      type: "makeRoom",
      isApi: true,
    }));
  });
}
