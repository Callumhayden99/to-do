import bcrypt from 'bcryptjs';
import prisma from "../../../../prismaClient"; // Adjust the path as needed based on your project structure
 // Adjust the import path as necessary

export default async function handler(req, res) {
  const { email, password, name } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    return res.status(201).json(newUser);
  } catch (error) {
    if (error.code === 'P2002' && error.meta && error.meta.target.includes('email')) {
      // This is the error code for a unique constraint violation on email
      return res.status(409).json({ message: 'This email has already been used. Please log in or use a different email.' });
    } else {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}