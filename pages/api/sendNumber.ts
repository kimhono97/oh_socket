// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import ApiSocket from '../../util/ApiSocket';

type Data = {
  msg: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const strRoom = req.query.room;
  const pData = req.query.data;
  if (typeof pData != "string") {
    res.status(400).json({ msg: "data required" });
    return;
  }
  if (typeof strRoom != "string") {
    res.status(400).json({ msg: "room required" });
    return;
  }
  const nData = parseInt(pData);
  if (isNaN(nData)) {
    res.status(400).json({ msg: "not a number" });
    return;
  }
  const pApiSocket = ApiSocket.s_GetInstance();
  pApiSocket.DoAction(() => {
    pApiSocket.socket.emit("sendNumber", strRoom, nData.toString());
    res.status(200).json({ msg: "requested" });
  });
}
