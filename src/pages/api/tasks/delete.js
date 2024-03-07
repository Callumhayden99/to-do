// pages/api/tasks/[taskId].js (can be the same file as the update logic with an additional condition)
import { getSession } from 'next-auth/react';
import prisma from '../../../../prismaClient';

export default async function handler(req, res) {
  const { taskId } = req.query;
  if (req.method === 'DELETE') {
    try {
      const session = await getSession({ req });
      if (!session || !session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const deletedTask = await prisma.task.delete({
        where: { id: parseInt(taskId) },
      });

      return res.status(200).json(deletedTask);
    } catch (error) {
      console.error('Failed to delete task:', error);
      return res.status(500).json({ error: 'Failed to delete task' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end('Method Not Allowed');
  }
}
