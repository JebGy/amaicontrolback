import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "../../generated/prisma";
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
  } catch (error: any) {
    console.error('Database error:', error);
    if (error?.name === 'PrismaClientInitializationError') {
      return res.status(500).json({
        error: "Error de conexión a la base de datos",
        details: "Verifique la configuración de la base de datos y las variables de entorno"
      });
    }
    return res.status(500).json({
      error: "Error al leer registros",
      details: error?.message || 'Error desconocido'
    });
  }
}
