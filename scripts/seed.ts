import { MongoClient } from 'mongodb';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const MONGODB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/vastu_db';

async function seed() {
  const client = new MongoClient(MONGODB_URL);

  try {
    console.log('🌱 Starting database seed with demo data...');
    await client.connect();
    const db = client.db() as any;

    // Create admin user
    const hashedPassword = await bcryptjs.hash('ChangeMe123!', 10);
    const adminId = uuidv4();

    const adminUser: any = {
      _id: adminId,
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+919876543210',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Check if admin exists
    const existingAdmin = await db.collection('users').findOne({ email: 'admin@example.com' });
    if (!existingAdmin) {
      await db.collection('users').insertOne(adminUser);
      console.log('✅ Admin user created');
      console.log(`   Email: admin@example.com`);
      console.log(`   Password: ChangeMe123!`);
    } else {
      console.log('⏭️  Admin user already exists');
    }

    // Create test BA user
    const baId = uuidv4();
    const baPassword = await bcryptjs.hash('BA123456!', 10);
    const baUser: any = {
      _id: baId,
      email: 'ba@example.com',
      password: baPassword,
      role: 'BA',
      firstName: 'Rajesh',
      lastName: 'Kumar',
      phone: '+919876543211',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const existingBA = await db.collection('users').findOne({ email: 'ba@example.com' });
    if (!existingBA) {
      await db.collection('users').insertOne(baUser);
      console.log('✅ Test BA user created');
      console.log(`   Email: ba@example.com`);
      console.log(`   Password: BA123456!`);
    } else {
      console.log('⏭️  Test BA user already exists');
    }

    // Create BA profile
    const baProfileId = uuidv4();
    const baProfile: any = {
      _id: baProfileId,
      userId: baId,
      username: 'testba',
      loginType: 'email',
      phone: '+919876543211',
      expertise: 'Vastu Consultation',
      experience: 5,
      bio: 'Professional Vastu consultant with 5 years of experience',
      kycStatus: 'APPROVED',
      kycApprovedAt: new Date(),
      bankDetails: {
        accountNumber: '1234567890',
        ifscCode: 'SBIN0001234',
        accountHolder: 'Rajesh Kumar',
      },
      totalEarnings: 15000,
      approvedEarnings: 10000,
      referralCode: 'REF-RAJESH-001',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const existingProfile = await db.collection('baprofiles').findOne({ userId: baId });
    if (!existingProfile) {
      await db.collection('baprofiles').insertOne(baProfile);
      console.log('✅ BA profile created');
      console.log(`   Username: testba`);
      console.log(`   KYC Status: APPROVED`);
      console.log(`   Total Earnings: ₹15,000`);
    } else {
      console.log('⏭️  BA profile already exists');
    }

    // Create default commission settings
    const existingCommission = await db.collection('commissionsettings').findOne({ baId: null });
    if (!existingCommission) {
      const commissionSetting: any = {
        _id: uuidv4(),
        baId: null,
        commissionType: 'PERCENTAGE',
        commissionValue: 10,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await db.collection('commissionsettings').insertOne(commissionSetting);
      console.log('✅ Default commission setting created (10%)');
    } else {
      console.log('⏭️  Commission setting already exists');
    }

    // Create sample bookings
    const bookings = [
      {
        _id: uuidv4(),
        clientName: 'Amit Sharma',
        clientEmail: 'amit@example.com',
        clientPhone: '+919876543212',
        serviceType: 'BUSINESS_VASTU',
        bookingDate: new Date('2025-11-15'),
        bookingTime: '10:00 AM',
        status: 'CONFIRMED',
        referralCode: 'REF-RAJESH-001',
        baId: baId,
        amount: 5000,
        commission: 500,
        notes: 'Business consultation for retail store',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: uuidv4(),
        clientName: 'Priya Patel',
        clientEmail: 'priya@example.com',
        clientPhone: '+919876543213',
        serviceType: 'RESIDENTIAL_VASTU',
        bookingDate: new Date('2025-11-20'),
        bookingTime: '02:00 PM',
        status: 'PENDING',
        referralCode: 'REF-RAJESH-001',
        baId: baId,
        amount: 3000,
        commission: 300,
        notes: 'Home vastu consultation',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: uuidv4(),
        clientName: 'Vikram Singh',
        clientEmail: 'vikram@example.com',
        clientPhone: '+919876543214',
        serviceType: 'HEALING_SESSION',
        bookingDate: new Date('2025-11-25'),
        bookingTime: '04:00 PM',
        status: 'COMPLETED',
        referralCode: 'REF-RAJESH-001',
        baId: baId,
        amount: 2000,
        commission: 200,
        notes: 'Energy healing session',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const booking of bookings) {
      const existingBooking = await db.collection('bookings').findOne({ _id: booking._id });
      if (!existingBooking) {
        await db.collection('bookings').insertOne(booking);
      }
    }
    console.log(`✅ ${bookings.length} sample bookings created`);

    // Create referral transactions
    const transactions = [
      {
        _id: uuidv4(),
        referrerId: baId,
        bookingId: bookings[0]._id,
        amount: 500,
        status: 'APPROVED',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: uuidv4(),
        referrerId: baId,
        bookingId: bookings[1]._id,
        amount: 300,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const transaction of transactions) {
      const existingTx = await db.collection('referraltransactions').findOne({ _id: transaction._id });
      if (!existingTx) {
        await db.collection('referraltransactions').insertOne(transaction);
      }
    }
    console.log(`✅ ${transactions.length} referral transactions created`);

    // Create sample coupons
    const coupons = [
      {
        _id: uuidv4(),
        code: 'VASTU10',
        discountPercentage: 10,
        discountAmount: null,
        globalUsageLimit: 100,
        currentUsage: 5,
        expiryDate: new Date('2025-12-31'),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: uuidv4(),
        code: 'HEALING20',
        discountPercentage: 20,
        discountAmount: null,
        globalUsageLimit: 50,
        currentUsage: 2,
        expiryDate: new Date('2025-12-31'),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const coupon of coupons) {
      const existingCoupon = await db.collection('couponcodes').findOne({ code: coupon.code });
      if (!existingCoupon) {
        await db.collection('couponcodes').insertOne(coupon);
      }
    }
    console.log(`✅ ${coupons.length} coupons created`);

    // Assign coupons to BA
    const couponAssignments = [
      {
        _id: uuidv4(),
        couponId: coupons[0]._id,
        baId: baId,
        perUserUsageLimit: 5,
        currentUsage: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: uuidv4(),
        couponId: coupons[1]._id,
        baId: baId,
        perUserUsageLimit: 3,
        currentUsage: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const assignment of couponAssignments) {
      const existingAssignment = await db.collection('couponassignments').findOne({
        couponId: assignment.couponId,
        baId: assignment.baId
      });
      if (!existingAssignment) {
        await db.collection('couponassignments').insertOne(assignment);
      }
    }
    console.log(`✅ ${couponAssignments.length} coupon assignments created`);

    // Create withdrawal requests
    const withdrawals = [
      {
        _id: uuidv4(),
        baId: baId,
        amount: 5000,
        status: 'APPROVED',
        bankDetails: {
          accountNumber: '1234567890',
          ifscCode: 'SBIN0001234',
          accountHolder: 'Rajesh Kumar',
        },
        approvedAt: new Date(),
        createdAt: new Date('2025-10-20'),
        updatedAt: new Date(),
      },
      {
        _id: uuidv4(),
        baId: baId,
        amount: 3000,
        status: 'PENDING',
        bankDetails: {
          accountNumber: '1234567890',
          ifscCode: 'SBIN0001234',
          accountHolder: 'Rajesh Kumar',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const withdrawal of withdrawals) {
      const existingWithdrawal = await db.collection('withdrawalrequests').findOne({ _id: withdrawal._id });
      if (!existingWithdrawal) {
        await db.collection('withdrawalrequests').insertOne(withdrawal);
      }
    }
    console.log(`✅ ${withdrawals.length} withdrawal requests created`);

    console.log('\n' + '='.repeat(60));
    console.log('🎉 DATABASE SEED COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n📋 TEST CREDENTIALS:\n');
    console.log('ADMIN:');
    console.log('  Email: admin@example.com');
    console.log('  Password: ChangeMe123!');
    console.log('\nBA USER:');
    console.log('  Email: ba@example.com');
    console.log('  Password: BA123456!');
    console.log('\n📊 DEMO DATA CREATED:');
    console.log('  ✅ 1 Admin user');
    console.log('  ✅ 1 BA user with approved KYC');
    console.log('  ✅ 3 Sample bookings (PENDING, CONFIRMED, COMPLETED)');
    console.log('  ✅ 2 Referral transactions');
    console.log('  ✅ 2 Coupons');
    console.log('  ✅ 2 Coupon assignments');
    console.log('  ✅ 2 Withdrawal requests');
    console.log('\n' + '='.repeat(60));
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();

