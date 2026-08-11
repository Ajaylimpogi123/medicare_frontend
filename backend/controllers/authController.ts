// backend/controllers/authController.ts
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client';



export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, first_name, last_name } = req.body;

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email is already in use' });
      return;
    }

    // 2. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        first_name,
        last_name,
      },
    });

    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_this_in_production';
    const { email, password } = req.body;

    // 1. Find the user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // 2. Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // 3. Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ 
      message: 'Login successful', 
      token,
      user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
};