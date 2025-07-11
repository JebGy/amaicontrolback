
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, TransactionType } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = await req.body;
    const { amount, description, category, type, date } = body;

    if (
      typeof amount !== 'number' ||
      typeof description !== 'string' ||
      typeof category !== 'string' ||
      typeof date !== 'string' ||
      !['INCOME', 'EXPENSE'].includes(type)
    ) {
      return res.json({ error: 'Datos inválidos' });
    }

    const registro = await prisma.transaction.create({
      data: {
        amount,
        description,
        category,
        type: type as TransactionType,
        date,
      },
    });

    return res.json(registro);
  } catch (error) {
    return res.json({ error: 'Error al agregar registro', details: error });
  }
}
