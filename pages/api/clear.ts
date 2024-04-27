// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import ApiSocket from '../../util/ApiSocket';

type Data = {
  result: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const pApiSocket = ApiSocket.s_GetInstance();
  pApiSocket.DoAction(() => {
    pApiSocket.socket.emit("clearRooms");
    res.status(200).json({ result: true });
  });
}
