// backend/prisma/client.ts  (or backend/lib/prisma.ts)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;