import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, TransactionType } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, description, type } = body;

    if (
      typeof amount !== 'number' ||
      typeof description !== 'string' ||
      !['INCOME', 'EXPENSE'].includes(type)
    ) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const registro = await prisma.transaction.create({
      data: {
        amount,
        description,
        type: type as TransactionType,
      },
    });

    return NextResponse.json(registro, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al agregar registro', details: error }, { status: 500 });
  }
}
