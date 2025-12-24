/**
 * Simple test for intake processing service
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Testing database connection...');

  try {
    const tenantCount = await prisma.tenant.count();
    console.log(`✅ Database connected! Found ${tenantCount} tenants`);

    const playerCount = await prisma.player.count();
    console.log(`✅ Found ${playerCount} players`);

    console.log('\n✅ Simple test passed!');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
