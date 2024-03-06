import { getSession } from 'next-auth/react';
import prisma from '../../../../prismaClient';


export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    try {
      const session = await getSession({ req });
      if (!session || !session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.body; // Expect `id` in the request body to identify the task

      const deletedTask = await prisma.task.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json(deletedTask);
    } catch (error) {
      // Handling cases where the task does not exist or the DB cannot be reached
      console.error('Failed to delete task:', error);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
