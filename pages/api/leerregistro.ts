import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma/prisma";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

// Middleware to verify JWT token
const verifyToken = (req: NextApiRequest): { userId: number } | null => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded;
  } catch (error) {
    return null;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Verify authentication
  const auth = verifyToken(req);
  if (!auth) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const registros = await prisma.transaction.findMany({
      where: {
        userId: auth.userId
      },
      orderBy: { date: "desc" },
    });
    return res.json(registros);
  } catch (error) {
    return res.status(500).json({
      error: "Error al leer registros",
      details: "Error desconocido",
      message: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}
