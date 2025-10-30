import { MongoClient } from 'mongodb';

const MONGODB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/vastu_db';

async function checkDB() {
  const client = new MongoClient(MONGODB_URL);

  try {
    console.log('🔍 Checking database...');
    await client.connect();
    const db = client.db();

    // Check users collection
    const users = await db.collection('users').find({}).toArray();
    console.log(`\n📊 Total users: ${users.length}`);
    
    if (users.length > 0) {
      console.log('\n👥 Users:');
      users.forEach((user: any) => {
        console.log(`  - ${user.email} (${user.role})`);
      });
    }

    // Check for admin
    const admin = await db.collection('users').findOne({ email: 'admin@example.com' });
    if (admin) {
      console.log('\n✅ Admin user found:');
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Password hash: ${admin.password.substring(0, 20)}...`);
    } else {
      console.log('\n❌ Admin user NOT found');
    }

    // Check commission settings
    const commissions = await db.collection('commissionsettings').find({}).toArray();
    console.log(`\n💰 Commission settings: ${commissions.length}`);
    
    if (commissions.length > 0) {
      commissions.forEach((c: any) => {
        console.log(`  - ${c.commissionValue}% (${c.commissionType})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

checkDB();

