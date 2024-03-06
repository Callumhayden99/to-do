// pages/api/tasks/create.js
import { getSession } from 'next-auth/react';
import prisma from '../../../../prismaClient';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const session = await getSession({ req });
      // Verify if the user is authenticated
      if (!session || !session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Extract user ID from the session
      const userId = session.user.id; // Make sure session.user.id is correctly set up in your authentication logic
      
      // Extract task details from the request body
      const { title } = req.body;

      // Validate input
      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      // Create a new task in the database
      const task = await prisma.task.create({
        data: {
          title,
          userId, // Associate task with the logged-in user
        },
      });

      // Respond with the created task
      return res.status(201).json(task);
    } catch (error) {
      console.error("Task creation failed: ", error);
      return res.status(500).json({ error: "Failed to create task" });
    }
  } else {
    // If the request method is not POST, return 405 Method Not Allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
