import { MongoClient } from 'mongodb';

const MONGO_URL = 'mongodb+srv://vaidik_vaastu:JCT2025@vaastu.sxjlbge.mongodb.net/vastu_db';

async function cleanupOrphanedProfiles() {
  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();
    const db = client.db('vastu_db');

    console.log('🧹 Cleaning up orphaned BA profiles...\n');

    // Get all BA profiles
    const baProfiles = await db.collection('baprofiles').find({}).toArray();
    console.log(`Found ${baProfiles.length} BA profiles\n`);

    let orphanedCount = 0;

    // Check each profile
    for (const profile of baProfiles) {
      const user = await db.collection('users').findOne({ _id: profile.userId });
      
      if (!user) {
        console.log(`❌ Orphaned profile found:`);
        console.log(`   Username: ${profile.username || 'N/A'}`);
        console.log(`   User ID: ${profile.userId}`);
        console.log(`   Email: ${profile.email || 'N/A'}`);
        
        // Delete the orphaned profile
        await db.collection('baprofiles').deleteOne({ _id: profile._id });
        console.log(`   ✅ Deleted\n`);
        
        orphanedCount++;
      }
    }

    console.log(`\n✅ Cleanup complete!`);
    console.log(`   Orphaned profiles deleted: ${orphanedCount}`);
    console.log(`   Remaining profiles: ${baProfiles.length - orphanedCount}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

cleanupOrphanedProfiles();

