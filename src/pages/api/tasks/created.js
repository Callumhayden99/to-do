
import prisma from '../../../../prismaClient';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Extract task details from the request body
    const { title, userId } = req.body;
    try {
      // Create a new task in the database
      const task = await prisma.task.create({
        data: {
          title,
          // Make sure the userId is passed correctly
          userId,
        },
      });
      return res.status(200).json(task);
    } catch (error) {
      // Handle potential errors, such as invalid userId
      console.error("Task creation failed: ", error);
      return res.status(500).json({ error: "Failed to create task" });
    }
  } else {
    // Method Not Allowed
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
