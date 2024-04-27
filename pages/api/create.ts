// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import ApiSocket from '../../util/ApiSocket';

type Data = {
  roomId: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const pApiSocket = ApiSocket.s_GetInstance();
  const pListener = (roomId: string) => {
    pApiSocket.socket.off("newRoom", pListener);
    res.status(200).json({ roomId: roomId });
  };
  pApiSocket.socket.on("newRoom", pListener);
  pApiSocket.DoAction(() => {
    pApiSocket.socket.emit("makeRoom");
  });
}
