import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const LOCAL_DB_URL = 'mongodb://localhost:27017/vastu_db';
const ATLAS_DB_URL = process.env.DATABASE_URL || 'mongodb+srv://vaidik_vaastu:XYYmdD1JgA50pdKA@vaastu.sxjlbge.mongodb.net/vastu_db?retryWrites=true&w=majority';
const DB_NAME = 'vastu_db';

interface MigrationStats {
  collection: string;
  documentsCount: number;
  status: 'success' | 'error';
  error?: string;
}

async function migrateDatabase() {
  let localClient: MongoClient | null = null;
  let atlasClient: MongoClient | null = null;
  const stats: MigrationStats[] = [];

  try {
    console.log('🚀 Starting MongoDB migration from Local to Atlas...\n');

    // Connect to local MongoDB
    console.log('📍 Connecting to local MongoDB...');
    localClient = new MongoClient(LOCAL_DB_URL);
    await localClient.connect();
    const localDb = localClient.db(DB_NAME);
    console.log('✅ Connected to local MongoDB\n');

    // Connect to MongoDB Atlas
    console.log('☁️  Connecting to MongoDB Atlas...');
    atlasClient = new MongoClient(ATLAS_DB_URL);
    await atlasClient.connect();
    const atlasDb = atlasClient.db(DB_NAME);
    console.log('✅ Connected to MongoDB Atlas\n');

    // Get all collections from local database
    console.log('📋 Fetching collections from local database...');
    const collections = await localDb.listCollections().toArray();
    console.log(`Found ${collections.length} collections\n`);

    // Migrate each collection
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`\n📦 Migrating collection: ${collectionName}`);

      try {
        const localCollection = localDb.collection(collectionName);
        const atlasCollection = atlasDb.collection(collectionName);

        // Get document count
        const count = await localCollection.countDocuments();
        console.log(`   Documents to migrate: ${count}`);

        if (count === 0) {
          console.log(`   ⏭️  Skipping empty collection`);
          stats.push({
            collection: collectionName,
            documentsCount: 0,
            status: 'success',
          });
          continue;
        }

        // Check if collection already exists in Atlas
        const atlasCount = await atlasCollection.countDocuments();
        if (atlasCount > 0) {
          console.log(`   ⚠️  Collection already exists in Atlas with ${atlasCount} documents`);
          console.log(`   Clearing existing data...`);
          await atlasCollection.deleteMany({});
        }

        // Fetch all documents from local collection
        const documents = await localCollection.find({}).toArray();

        // Insert documents into Atlas collection
        if (documents.length > 0) {
          const result = await atlasCollection.insertMany(documents);
          console.log(`   ✅ Successfully migrated ${result.insertedCount} documents`);
          stats.push({
            collection: collectionName,
            documentsCount: result.insertedCount,
            status: 'success',
          });
        }
      } catch (error) {
        console.error(`   ❌ Error migrating collection ${collectionName}:`, error);
        stats.push({
          collection: collectionName,
          documentsCount: 0,
          status: 'error',
          error: String(error),
        });
      }
    }

    // Print migration summary
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));

    let totalDocuments = 0;
    let successCount = 0;
    let errorCount = 0;

    for (const stat of stats) {
      const status = stat.status === 'success' ? '✅' : '❌';
      console.log(`${status} ${stat.collection.padEnd(30)} - ${stat.documentsCount} documents`);
      if (stat.status === 'success') {
        totalDocuments += stat.documentsCount;
        successCount++;
      } else {
        errorCount++;
      }
    }

    console.log('='.repeat(60));
    console.log(`\n📈 Total Documents Migrated: ${totalDocuments}`);
    console.log(`✅ Successful Collections: ${successCount}`);
    console.log(`❌ Failed Collections: ${errorCount}`);
    console.log('\n🎉 Migration completed!\n');

    if (errorCount === 0) {
      console.log('✨ All collections migrated successfully!');
      console.log('Your MongoDB Atlas database is now ready for production.\n');
    } else {
      console.log('⚠️  Some collections failed to migrate. Please check the errors above.\n');
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    // Close connections
    if (localClient) {
      await localClient.close();
      console.log('Closed local MongoDB connection');
    }
    if (atlasClient) {
      await atlasClient.close();
      console.log('Closed MongoDB Atlas connection');
    }
  }
}

// Run migration
migrateDatabase().catch(console.error);

