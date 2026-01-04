/**
 * Seed Demo Users
 * Creates demo users for testing: admin, coach, and player
 */

import prisma from '../client';
import * as argon2 from 'argon2';


export async function seedDemoUsers() {
  console.log('🌱 Seeding demo users...');

  try {
    // Create or get tenant
    let tenant = await prisma.tenant.findFirst({
      where: { slug: 'ak-golf-academy' },
    });

    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          name: 'AK Golf Academy',
          slug: 'ak-golf-academy',
          subscriptionTier: 'premium',
          maxPlayers: 100,
          maxCoaches: 20,
          status: 'active',
        },
      });
      console.log('   ✅ Created tenant: AK Golf Academy');
    }

    // Hash passwords
    const adminPassword = await argon2.hash('admin123');
    const coachPassword = await argon2.hash('coach123');
    const playerPassword = await argon2.hash('player123');

    // Create Admin User
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@demo.com' },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'admin@demo.com',
        passwordHash: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
      },
    });
    console.log('   ✅ Created admin user: admin@demo.com / admin123');

    // Create Coach User
    const coachUser = await prisma.user.upsert({
      where: { email: 'coach@demo.com' },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'coach@demo.com',
        passwordHash: coachPassword,
        firstName: 'Anders',
        lastName: 'Kristiansen',
        role: 'coach',
        isActive: true,
      },
    });

    // Create Coach Profile
    let coach = await prisma.coach.findFirst({
      where: { email: 'coach@demo.com' },
    });

    if (!coach) {
      coach = await prisma.coach.create({
        data: {
          tenantId: tenant.id,
          firstName: 'Anders',
          lastName: 'Kristiansen',
          email: 'coach@demo.com',
          phone: '+47 123 45 678',
          specializations: ['Driver', 'Short Game', 'Mental Training'],
          certifications: ['PGA Professional', 'Team Norway Coach'],
          workingHours: {
            monday: { start: '08:00', end: '17:00' },
            tuesday: { start: '08:00', end: '17:00' },
            wednesday: { start: '08:00', end: '17:00' },
            thursday: { start: '08:00', end: '17:00' },
            friday: { start: '08:00', end: '17:00' },
          },
        },
      });
      console.log('   ✅ Created coach user: coach@demo.com / coach123');
    } else {
      console.log('   ⚠️  Coach already exists, skipping');
    }

    // Create Player User
    const playerUser = await prisma.user.upsert({
      where: { email: 'player@demo.com' },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'player@demo.com',
        passwordHash: playerPassword,
        firstName: 'Ole',
        lastName: 'Hansen',
        role: 'player',
        isActive: true,
      },
    });

    // Create Player Profile
    let player = await prisma.player.findFirst({
      where: { email: 'player@demo.com' },
    });

    if (!player) {
      player = await prisma.player.create({
        data: {
          tenantId: tenant.id,
          firstName: 'Ole',
          lastName: 'Hansen',
          email: 'player@demo.com',
          dateOfBirth: new Date('2005-06-15'),
          gender: 'male',
          phone: '+47 987 65 432',
          category: 'B',
          handicap: 5.4,
          club: 'Oslo Golf Club',
          goals: ['Reach Category A', 'Improve driver distance', 'Better short game'],
          emergencyContact: {
            name: 'Per Hansen',
            phone: '+47 999 88 777',
            email: 'per.hansen@example.com',
          },
        },
      });
      console.log('   ✅ Created player user: player@demo.com / player123');
    } else {
      console.log('   ⚠️  Player already exists, skipping');
    }

    // Assign coach to player
    if (player.coachId !== coach.id) {
      await prisma.player.update({
        where: { id: player.id },
        data: { coachId: coach.id },
      });
      console.log('   ✅ Assigned coach to player');
    }

    console.log('\n📊 Demo Users Summary:');
    console.log('   • Admin: admin@demo.com / admin123');
    console.log('   • Coach: coach@demo.com / coach123');
    console.log('   • Player: player@demo.com / player123');

  } catch (error) {
    console.error('❌ Error seeding demo users:', error);
    throw error;
  }
}
