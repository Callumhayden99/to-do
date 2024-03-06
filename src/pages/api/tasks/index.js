// pages/api/tasks/index.js
import { getSession } from 'next-auth/react';
import prisma from '../../../../prismaClient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const session = await getSession({ req });
      if (!session || !session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userId = session.user.id; // Directly use userId from session

      const tasks = await prisma.task.findMany({
        where: {
          userId: userId, // Fetch tasks for the logged-in user
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json(tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      return res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end('Method Not Allowed');
  }
}
