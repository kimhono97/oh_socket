// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  response: string,
  verify: string,
}

const default_verify_token = "3e6d148a-3e70-43fb-9cdb-1383dabdf517";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let strRoom: string|undefined = "";
  let strData: string|undefined = "";
  let verify_token = default_verify_token;
  if (req.method == "POST") {
    const strBody = (typeof req.body == "object") ? JSON.stringify(req.body) : req.body.toString() as string;
    console.log("POST /api/sendNumber\n\t" + strBody);
    const nStartIndex = strBody.indexOf("{");
    if (nStartIndex < 0) {
      res.status(400).json({
        response: "invalid post parameter",
        verify: verify_token,
      });
      return;
    }
    let pJson = JSON.parse(strBody.slice(nStartIndex));
    if (pJson.request) {
      pJson = JSON.parse(pJson.request.toString());
    }
    strRoom = pJson.room?.toString();
    strData = pJson.data?.toString();
    if (pJson.verify) {
      verify_token = pJson.verify.toString();
    }
  } else if (req.method == "GET") {
    strRoom = req.query.room?.toString();
    strData = req.query.data?.toString();
    if (req.query.verify) {
      verify_token = req.query.verify.toString();
    }
  }
  if (typeof strData != "string" || !strData) {
    res.status(400).json({
      response: "data required",
      verify: verify_token,
    });
    return;
  }
  if (typeof strRoom != "string" || !strRoom) {
    res.status(400).json({
      response: "room required",
      verify: verify_token,
    });
    return;
  }
  const nData = parseInt(strData);
  if (isNaN(nData)) {
    res.status(400).json({
      response: "not a number",
      verify: verify_token,
    });
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
  res.status(200).json({
    response: "requested successfully",
    verify: verify_token,
  });
}
