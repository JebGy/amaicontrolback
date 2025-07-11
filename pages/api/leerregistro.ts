import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
 res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  try {
    const registros = await prisma.transaction.findMany({
      orderBy: { date: "desc" },
    });
    return res.json(registros);
  } catch (error) {
    return res.json({ error: "Error al leer registros", details: error });
  }
}
