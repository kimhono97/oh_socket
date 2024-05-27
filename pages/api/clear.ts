// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  result: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const ws = new WebSocket("ws://localhost:3001");
  ws.addEventListener("open", () => {
    ws.send(JSON.stringify({
      type: "clearRooms",
      isApi: true,
    }));
    ws.close();
  });
  res.status(200).json({ result: true });
}
