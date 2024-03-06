// pages/api/tasks/[taskId].js
import { getSession } from 'next-auth/react';
import prisma from '../../../../prismaClient';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      const session = await getSession({ req });
      if (!session || !session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { taskId } = req.query; // Assuming you're using dynamic API routes
      const { title, completed } = req.body;

      const updatedTask = await prisma.task.update({
        where: { id: parseInt(taskId) },
        data: { title, completed },
      });

      return res.status(200).json(updatedTask);
    } catch (error) {
      console.error('Failed to update task:', error);
      return res.status(500).json({ error: 'Failed to update task' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end('Method Not Allowed');
  }
}
