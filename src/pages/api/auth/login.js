// pages/api/auth/login.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../../..prismaClient";

export default async function handler(req, res) {
  const { email, password } = req.body;
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    // Assuming you want to continue with the JWT approach for some custom handling.
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET,
      { expiresIn: "8h" }
    );

    // Instead of returning the token directly,
    // consider setting an HTTP-Only cookie with the token,
    // or better yet, migrate this logic to use NextAuth.js for session management.
    res.status(200).json({ success: true });
  } else {
    return res.status(400).json({ message: "Invalid credentials" });
  }
}