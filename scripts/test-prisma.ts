import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    console.log('🔍 Testing Prisma connection...');

    // Get all users
    const users = await prisma.user.findMany();
    console.log(`\n📊 Total users (Prisma): ${users.length}`);
    
    if (users.length > 0) {
      console.log('\n👥 Users:');
      users.forEach((user: any) => {
        console.log(`  - ${user.email} (${user.role})`);
      });
    }

    // Try to find admin
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' },
    });

    if (admin) {
      console.log('\n✅ Admin found via Prisma:');
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
    } else {
      console.log('\n❌ Admin NOT found via Prisma');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();

