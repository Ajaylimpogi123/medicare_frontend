// backend/scripts/seed.ts
import bcrypt from 'bcrypt';
import prisma from '../prisma/client';


async function main() {
  const hashedPassword = await bcrypt.hash('12345678', 10);

  // upsert means it will create the user, or do nothing if the email already exists
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cravecare.com' },
    update: {},
    create: {
      email: 'admin@cravecare.com',
      password: hashedPassword,
      first_name: 'Admin',
      last_name: 'User',
      role: 'ADMIN', // Explicitly setting the admin role
    },
  });

  console.log('Admin user ready:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });