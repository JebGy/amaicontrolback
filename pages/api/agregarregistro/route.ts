
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, TransactionType } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = await req.body;
    const { amount, description, type } = body;

    if (
      typeof amount !== 'number' ||
      typeof description !== 'string' ||
      !['INCOME', 'EXPENSE'].includes(type)
    ) {
      return res.json({ error: 'Datos inválidos' });
    }

    const registro = await prisma.transaction.create({
      data: {
        amount,
        description,
        type: type as TransactionType,
      },
    });

    return res.json(registro);
  } catch (error) {
    return res.json({ error: 'Error al agregar registro', details: error });
  }
}
