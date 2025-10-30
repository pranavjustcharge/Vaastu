import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/auth';
import { config } from '../src/config/env';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await hashPassword(config.admin.password);
  const admin = await prisma.user.upsert({
    where: { email: config.admin.email },
    update: {},
    create: {
      email: config.admin.email,
      password: adminPassword,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'User',
    },
  });

  console.log(`✅ Admin user created: ${admin.email}`);

  // Create global commission setting
  const globalCommission = await prisma.commissionSetting.upsert({
    where: { baId: null },
    update: {},
    create: {
      commissionType: 'PERCENTAGE',
      commissionValue: 10,
      isActive: true,
    },
  });

  console.log(`✅ Global commission setting created: ${globalCommission.commissionValue}%`);

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

