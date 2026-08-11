// backend/controllers/adminController.ts

import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const createStaffUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, first_name, last_name, role } = req.body;

    // 1. Validate the role against your Prisma Enum
    const validRoles = ['DOCTOR', 'SECRETARY'];
    if (!validRoles.includes(role)) {
      res.status(400).json({ error: 'Invalid role. Must be DOCTOR or SECRETARY.' });
      return;
    }

    // 2. Check if the email is already registered
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email is already in use.' });
      return;
    }

    // 3. Hash the new staff member's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Save to database
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        first_name,
        last_name,
        role, 
      },
    });

    res.status(201).json({ 
      message: `${role} account created successfully!`, 
      userId: newUser.id 
    });
  } catch (error) {
    console.error("Error creating staff:", error);
    res.status(500).json({ error: 'Internal server error while creating user.' });
  }
};