
import { NextApiRequest, NextApiResponse } from 'next';
import {  TransactionType } from '../../generated/prisma';
import prisma from '@/prisma/prisma';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

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
