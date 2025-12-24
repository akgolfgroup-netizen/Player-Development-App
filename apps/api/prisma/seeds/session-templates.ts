/**
 * Seed Session Templates
 * Sample session templates for all periods (E, G, S, T)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sessionTemplates = [
  // ============================================
  // E PERIOD (Enkelt - Easy/Fundamental)
  // ============================================
  {
    name: 'Basic Swing Fundamentals',
    description: 'Focus on fundamental movement patterns and basic technique',
    sessionType: 'technical',
    learningPhase: 'L1',
    setting: 'S1',
    clubSpeed: 'CS90',
    categories: ['TE'],
    periods: ['E'],
    duration: 90,
    exerciseSequence: {
      warmup: ['Mobility work', 'Basic stretching'],
      main: ['Grip fundamentals', 'Posture setup', 'Swing plane basics'],
      cooldown: ['Light stretching'],
    },
    objectives: 'Establish correct grip, posture, and basic swing fundamentals',
    structure: '15min warmup, 60min technique work, 15min review',
    successCriteria: 'Player demonstrates consistent grip and setup position',
  },
  {
    name: 'Physical Foundation Building',
    description: 'General physical conditioning and movement literacy',
    sessionType: 'physical',
    learningPhase: 'L1',
    setting: 'S2',
    clubSpeed: 'CS90',
    categories: ['PH'],
    periods: ['E'],
    duration: 60,
    exerciseSequence: {
      warmup: ['Dynamic stretching', 'Light cardio'],
      main: ['Core stability', 'Hip mobility', 'Rotational exercises'],
      cooldown: ['Static stretching'],
    },
    objectives: 'Build foundational strength and mobility for golf movements',
    structure: '10min warmup, 40min conditioning, 10min cooldown',
    successCriteria: 'Improved mobility scores and core stability',
  },
  {
    name: 'Introduction to Mental Game',
    description: 'Basic mental skills and focus training',
    sessionType: 'mental',
    learningPhase: 'L1',
    setting: 'S1',
    clubSpeed: 'CS90',
    categories: ['ME'],
    periods: ['E'],
    duration: 45,
    exerciseSequence: {
      warmup: ['Breathing exercises'],
      main: ['Focus drills', 'Visualization basics', 'Pre-shot routine development'],
      cooldown: ['Reflection'],
    },
    objectives: 'Introduce basic mental skills for golf performance',
    structure: '5min breathing, 35min mental skills, 5min reflection',
    successCriteria: 'Player can execute consistent pre-shot routine',
  },

  // ============================================
  // G PERIOD (Generell - General)
  // ============================================
  {
    name: 'Ball Striking Development',
    description: 'General ball striking skills across all clubs',
    sessionType: 'technical',
    learningPhase: 'L2',
    setting: 'S4',
    clubSpeed: 'CS90',
    categories: ['TE', 'GS'],
    periods: ['G'],
    duration: 120,
    exerciseSequence: {
      warmup: ['Wedge tempo swings', 'Alignment check'],
      main: ['Iron contact drills', 'Driver path work', 'Distance control'],
      cooldown: ['Target practice'],
    },
    objectives: 'Develop consistent ball striking across different clubs',
    structure: '15min warmup, 90min practice, 15min target work',
    successCriteria: 'Improved strike quality metrics on trackman',
  },
  {
    name: 'Short Game Fundamentals',
    description: 'Chipping, pitching, and bunker basics',
    sessionType: 'technical',
    learningPhase: 'L2',
    setting: 'S5',
    clubSpeed: 'CS90',
    categories: ['GS'],
    periods: ['G'],
    duration: 90,
    exerciseSequence: {
      warmup: ['Putting stroke', 'Chip feel drills'],
      main: ['Distance control pitching', 'Trajectory variations', 'Bunker technique'],
      cooldown: ['Up-and-down challenge'],
    },
    objectives: 'Master fundamental short game techniques',
    structure: '10min warmup, 70min skill work, 10min challenge',
    successCriteria: '70% up-and-down rate from 20 yards',
  },
  {
    name: 'Golf-Specific Conditioning',
    description: 'Sport-specific physical training',
    sessionType: 'physical',
    learningPhase: 'L3',
    setting: 'S3',
    clubSpeed: 'CS90',
    categories: ['PH'],
    periods: ['G'],
    duration: 75,
    exerciseSequence: {
      warmup: ['Golf-specific movements', 'Dynamic stretching'],
      main: ['Rotational power', 'Club speed training', 'Stability work'],
      cooldown: ['Recovery stretching'],
    },
    objectives: 'Increase golf-specific power and club speed',
    structure: '15min warmup, 50min power work, 10min cooldown',
    successCriteria: '3-5% increase in club speed measurements',
  },

  // ============================================
  // S PERIOD (Spesifikk - Specific)
  // ============================================
  {
    name: 'Course Management Strategy',
    description: 'Strategic decision making and shot selection',
    sessionType: 'tactical',
    learningPhase: 'L4',
    setting: 'S7',
    clubSpeed: 'CS90',
    categories: ['PL', 'CO'],
    periods: ['S'],
    duration: 120,
    exerciseSequence: {
      warmup: ['Target awareness drills'],
      main: ['Simulated holes', 'Risk-reward scenarios', 'Strategy mapping'],
      cooldown: ['Course strategy review'],
    },
    objectives: 'Develop course management and strategic thinking skills',
    structure: '10min warmup, 100min simulation, 10min debrief',
    successCriteria: 'Optimal shot selection in 80% of scenarios',
  },
  {
    name: 'Pressure Performance Training',
    description: 'Competition-specific mental and technical skills',
    sessionType: 'mental',
    learningPhase: 'L4',
    setting: 'S8',
    clubSpeed: 'CS90',
    categories: ['ME', 'CO'],
    periods: ['S'],
    duration: 90,
    exerciseSequence: {
      warmup: ['Performance breathing', 'Visualization'],
      main: ['Pressure putting', 'Consequences drills', 'Competition simulation'],
      cooldown: ['Performance review'],
    },
    objectives: 'Build mental resilience under competitive pressure',
    structure: '10min mental prep, 70min pressure drills, 10min review',
    successCriteria: 'Maintain performance quality under pressure conditions',
  },
  {
    name: 'Breaking Point Focus Session',
    description: 'Targeted work on individual weaknesses',
    sessionType: 'technical',
    learningPhase: 'L3',
    setting: 'S6',
    clubSpeed: 'CS90',
    categories: ['TE', 'GS'],
    periods: ['S'],
    duration: 105,
    exerciseSequence: {
      warmup: ['Movement preparation'],
      main: ['Specific club work', 'Weakness drills', 'Progress measurement'],
      cooldown: ['Transfer practice'],
    },
    objectives: 'Address specific breaking points identified in assessment',
    structure: '15min prep, 80min focused practice, 10min transfer',
    successCriteria: 'Measurable improvement in targeted metrics',
  },

  // ============================================
  // T PERIOD (Turnering - Tournament)
  // ============================================
  {
    name: 'Tournament Preparation',
    description: 'Final tune-up before competition',
    sessionType: 'tactical',
    learningPhase: 'L5',
    setting: 'S9',
    clubSpeed: 'CS90',
    categories: ['CO', 'PL'],
    periods: ['T'],
    duration: 60,
    exerciseSequence: {
      warmup: ['Range routine', 'Feel checks'],
      main: ['Confidence builders', 'Key shots practice', 'Mental rehearsal'],
      cooldown: ['Positive imagery'],
    },
    objectives: 'Build confidence and maintain sharpness for competition',
    structure: '10min routine, 40min key shots, 10min mental prep',
    successCriteria: 'Feeling confident and ready to compete',
  },
  {
    name: 'Competition Day Warmup',
    description: 'Pre-tournament activation routine',
    sessionType: 'technical',
    learningPhase: 'L5',
    setting: 'S10',
    clubSpeed: 'CS90',
    categories: ['CO'],
    periods: ['T'],
    duration: 45,
    exerciseSequence: {
      warmup: ['Physical activation', 'Putting feel'],
      main: ['Swing check', 'Distance calibration', 'Mental centering'],
      cooldown: ['Final focus'],
    },
    objectives: 'Optimal physical and mental preparation for competition',
    structure: '10min activation, 30min calibration, 5min centering',
    successCriteria: 'Ready to perform at optimal level',
  },
  {
    name: 'Recovery and Reflection',
    description: 'Post-competition recovery and analysis',
    sessionType: 'recovery',
    learningPhase: 'L4',
    setting: 'S8',
    clubSpeed: 'CS90',
    categories: ['PH', 'ME'],
    periods: ['T'],
    duration: 60,
    exerciseSequence: {
      warmup: ['Light movement'],
      main: ['Active recovery', 'Performance review', 'Lessons learned'],
      cooldown: ['Relaxation'],
    },
    objectives: 'Physical recovery and performance analysis',
    structure: '10min movement, 40min recovery/review, 10min relaxation',
    successCriteria: 'Ready for next training cycle with clear learnings',
  },

  // ============================================
  // Multi-Period Templates (E+G, G+S, S+T)
  // ============================================
  {
    name: 'Transition: Skill Integration',
    description: 'Bridging fundamental to general skills',
    sessionType: 'technical',
    learningPhase: 'L2',
    setting: 'S3',
    clubSpeed: 'CS90',
    categories: ['TE', 'GS'],
    periods: ['E', 'G'],
    duration: 90,
    exerciseSequence: {
      warmup: ['Movement review'],
      main: ['Skill progression', 'Integration drills', 'Transfer practice'],
      cooldown: ['Review and planning'],
    },
    objectives: 'Integrate fundamental skills into golf-specific movements',
    structure: '10min review, 70min integration, 10min planning',
    successCriteria: 'Smooth execution of integrated skills',
  },
  {
    name: 'Transition: Competition Preparation',
    description: 'Moving from specific skills to competition readiness',
    sessionType: 'tactical',
    learningPhase: 'L4',
    setting: 'S8',
    clubSpeed: 'CS90',
    categories: ['CO', 'PL'],
    periods: ['S', 'T'],
    duration: 90,
    exerciseSequence: {
      warmup: ['Mental preparation'],
      main: ['Pre-tournament practice', 'Strategy refinement', 'Confidence building'],
      cooldown: ['Mental rehearsal'],
    },
    objectives: 'Prepare mentally and strategically for upcoming competition',
    structure: '15min mental prep, 60min practice, 15min rehearsal',
    successCriteria: 'Confident and strategically prepared',
  },
];

export async function seedSessionTemplates() {
  console.log('📋 Seeding session templates...');

  // Get the test tenant (or first tenant if test doesn't exist)
  let tenant = await prisma.tenant.findFirst({
    where: { name: 'Test Golf Academy' },
  });

  if (!tenant) {
    tenant = await prisma.tenant.findFirst();
  }

  if (!tenant) {
    console.log('   ⚠️  No tenant found, skipping session template seed');
    return;
  }

  // Check if templates already exist
  const existingCount = await prisma.sessionTemplate.count({
    where: { tenantId: tenant.id },
  });

  if (existingCount > 0) {
    console.log(`   ⚠️  Found ${existingCount} existing templates, skipping seed`);
    return;
  }

  // Create all session templates
  let created = 0;
  for (const template of sessionTemplates) {
    await prisma.sessionTemplate.create({
      data: {
        ...template,
        tenantId: tenant.id,
        exerciseSequence: template.exerciseSequence as any,
      },
    });
    created++;
  }

  console.log(`   ✅ Created ${created} session templates across all periods (E, G, S, T)`);
}
