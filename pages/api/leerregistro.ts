import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma/prisma";

// Create a single instance of PrismaClient

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  try {
    const registros = await prisma.transaction.findMany({
      orderBy: { date: "desc" },
    });
    return res.json(registros);
  } catch (error) {
    return res.status(500).json({
      error: "Error al leer registros",
      details: "Error desconocido",
    });
  }
}
