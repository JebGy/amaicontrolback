
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const registros = await prisma.transaction.findMany({
      orderBy: { date: 'desc' },
    });
    return res.json(registros);
  } catch (error) {
    return res.json({ error: 'Error al leer registros', details: error });
  }
}
