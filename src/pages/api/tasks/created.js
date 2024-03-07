import { getSession } from "next-auth/react";
import prisma from "../../../../prismaClient";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  if (!session) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { title } = req.body;

  try {
    const task = await prisma.task.create({
      data: {
        title,
        userId: session.user.id, // Ensure this matches how you're storing user IDs in session
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Task creation failed:", error);
    res.status(500).json({ message: "Failed to create task" });
  }
}
