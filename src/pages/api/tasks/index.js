
import { getSession } from 'next-auth/react';
import prisma from '../../../../prismaClient';

export default async function handle(req, res) {
  if (req.method === 'GET') {
    try {
      // Get user session to identify the user
      const session = await getSession({ req });
      if (!session || !session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Assuming the session object contains the user's email or ID
      // Adjust accordingly based on your authentication setup
      const userEmail = session.user.email;

      // Fetch tasks from the database for the logged-in user
      const tasks = await prisma.task.findMany({
        where: {
          user: {
            email: userEmail,
          },
        },
        orderBy: {
          createdAt: 'desc', // Order by creation time, adjust as needed
        },
      });

      res.status(200).json(tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  } else {
    // If the request method is not GET, return 405 Method Not Allowed
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
