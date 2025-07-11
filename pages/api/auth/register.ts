import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma/prisma";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, password, name } = req.body;
    console.log("Attempting to register user:", { email, name }); // Log registration attempt

    // Validate input
    if (!email || !password || !name) {
      console.log("Missing fields:", {
        hasEmail: !!email,
        hasPassword: !!password,
        hasName: !!name,
      });
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    console.log("Existing user check result:", !!existingUser); // Log if user exists

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    console.log("User created successfully:", {
      id: user.id,
      email: user.email,
    }); // Log successful creation

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json(userWithoutPassword);
  } catch (error: unknown) {
    const err = error as Error & { code?: string };
    console.error("Registration error details:", {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack,
    });
    return res.status(500).json({
      message: "Internal server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
}
