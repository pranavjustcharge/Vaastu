import { MongoClient } from 'mongodb';

const MONGODB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/vastu_db';

async function listCollections() {
  const client = new MongoClient(MONGODB_URL);

  try {
    console.log('🔍 Listing MongoDB collections...');
    await client.connect();
    const db = client.db();

    const collections = await db.listCollections().toArray();
    console.log(`\n📊 Total collections: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('\n📋 Collections:');
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        console.log(`  - ${col.name} (${count} documents)`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

listCollections();

