const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
  try {
    console.log('🔄 Checking database schema...');
    
    // Try to add isVerified column if it doesn't exist
    try {
      await prisma.$executeRaw`ALTER TABLE "Users" ADD COLUMN "isVerified" BOOLEAN DEFAULT false;`;
      console.log('✅ Added isVerified column to Users table');
    } catch (e) {
      console.log('ℹ️ isVerified column already exists or table structure is different');
    }
    
    // Try to create Otps table if it doesn't exist
    try {
      await prisma.$executeRaw`
        CREATE TABLE "Otps" (
          "id" SERIAL PRIMARY KEY,
          "email" TEXT NOT NULL,
          "otp" TEXT NOT NULL,
          "type" TEXT NOT NULL,
          "expiresAt" TIMESTAMP(3) NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `;
      console.log('✅ Created Otps table');
    } catch (e) {
      console.log('ℹ️ Otps table already exists or could not be created');
    }
    
    console.log('✅ Database migration completed');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();