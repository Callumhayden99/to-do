import { getSession } from 'next-auth/react';
import prisma from '../../../../prismaClient';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      const session = await getSession({ req });
      if (!session || !session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id, title, completed } = req.body; // Add or remove fields based on your task model

      const updatedTask = await prisma.task.update({
        where: { id: parseInt(id) },
        data: { title, completed }, // Update only the fields provided
      });

      res.status(200).json(updatedTask);
    } catch (error) {
      console.error('Failed to update task:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
