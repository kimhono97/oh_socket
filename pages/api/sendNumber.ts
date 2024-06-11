// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  msg: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let strRoom: string|undefined = "";
  let strData: string|undefined = "";
  if (req.method == "POST") {
    const strBody = req.body.toString();
    const nStartIndex = strBody.indexOf("{");
    if (nStartIndex < 0) {
      res.status(400).json({ msg: "invalid post parameter" });
      return;
    }
    const pJson = JSON.parse(strBody.slice(nStartIndex));
    strRoom = pJson.room?.toString();
    strData = pJson.data?.toString();
  } else if (req.method == "GET") {
    strRoom = req.query.room?.toString();
    strData = req.query.data?.toString();
  }
  if (typeof strData != "string" || !strData) {
    res.status(400).json({ msg: "data required" });
    return;
  }
  if (typeof strRoom != "string" || !strRoom) {
    res.status(400).json({ msg: "room required" });
    return;
  }
  const nData = parseInt(strData);
  if (isNaN(nData)) {
    res.status(400).json({ msg: "not a number" });
    return;
  }
  const ws = new WebSocket("ws://localhost:3001");
  ws.addEventListener("open", () => {
    ws.send(JSON.stringify({
      type: "sendNumber",
      roomId: strRoom,
      data: nData,
      isApi: true,
    }));
    ws.close();
  });
  res.status(200).json({ msg: "requested" });
}
