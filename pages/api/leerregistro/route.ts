import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const registros = await prisma.transaction.findMany({
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(registros);
  } catch (error) {
    return NextResponse.json({ error: 'Error al leer registros', details: error }, { status: 500 });
  }
}
