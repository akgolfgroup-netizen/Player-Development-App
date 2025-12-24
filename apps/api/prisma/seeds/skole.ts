/**
 * Seed Skole
 * Fag, Skoletimer, og Oppgaver for elev-spillere
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedSkole() {
  console.log('🎓 Seeding skole data...');

  // Get the player user (students are players who are also users)
  const playerUser = await prisma.user.findFirst({
    where: { email: 'player@demo.com' },
  });

  if (!playerUser) {
    throw new Error('Player user not found. Run demo-users seed first.');
  }

  // ============================================
  // FAG (Subjects)
  // ============================================
  const fagData = [
    { navn: 'Matematikk', larer: 'Erik Mathisen', rom: 'A203', farge: '#3B82F6' },
    { navn: 'Norsk', larer: 'Anne Nordmann', rom: 'B105', farge: '#10B981' },
    { navn: 'Engelsk', larer: 'John Smith', rom: 'A201', farge: '#8B5CF6' },
    { navn: 'Naturfag', larer: 'Kari Forsker', rom: 'LAB1', farge: '#F59E0B' },
    { navn: 'Samfunnsfag', larer: 'Per Samfunn', rom: 'C102', farge: '#EF4444' },
    { navn: 'Kroppsøving', larer: 'Lars Aktiv', rom: 'GYM', farge: '#EC4899' },
    { navn: 'Idrettsfag', larer: 'Anders Kristiansen', rom: 'GOLF', farge: '#14B8A6' },
  ];

  const createdFag: { [key: string]: string } = {};
  let fagCreated = 0;

  for (const fag of fagData) {
    const existing = await prisma.fag.findFirst({
      where: {
        userId: playerUser.id,
        navn: fag.navn,
      },
    });

    if (!existing) {
      const created = await prisma.fag.create({
        data: {
          userId: playerUser.id,
          ...fag,
        },
      });
      createdFag[fag.navn] = created.id;
      fagCreated++;
    } else {
      createdFag[fag.navn] = existing.id;
    }
  }
  console.log(`   ✅ Created ${fagCreated} fag`);

  // ============================================
  // SKOLETIMER (School Schedule)
  // ============================================
  const timeplan = [
    // Mandag
    { fag: 'Matematikk', ukedag: 'mandag', startTid: '08:15', sluttTid: '09:45' },
    { fag: 'Norsk', ukedag: 'mandag', startTid: '10:00', sluttTid: '11:30' },
    { fag: 'Idrettsfag', ukedag: 'mandag', startTid: '12:30', sluttTid: '14:45' },

    // Tirsdag
    { fag: 'Engelsk', ukedag: 'tirsdag', startTid: '08:15', sluttTid: '09:45' },
    { fag: 'Naturfag', ukedag: 'tirsdag', startTid: '10:00', sluttTid: '11:30' },
    { fag: 'Samfunnsfag', ukedag: 'tirsdag', startTid: '12:30', sluttTid: '14:00' },

    // Onsdag
    { fag: 'Matematikk', ukedag: 'onsdag', startTid: '08:15', sluttTid: '09:45' },
    { fag: 'Kroppsøving', ukedag: 'onsdag', startTid: '10:00', sluttTid: '11:30' },
    { fag: 'Idrettsfag', ukedag: 'onsdag', startTid: '12:30', sluttTid: '15:00' },

    // Torsdag
    { fag: 'Norsk', ukedag: 'torsdag', startTid: '08:15', sluttTid: '09:45' },
    { fag: 'Engelsk', ukedag: 'torsdag', startTid: '10:00', sluttTid: '11:30' },
    { fag: 'Naturfag', ukedag: 'torsdag', startTid: '12:30', sluttTid: '14:00' },

    // Fredag
    { fag: 'Samfunnsfag', ukedag: 'fredag', startTid: '08:15', sluttTid: '09:45' },
    { fag: 'Matematikk', ukedag: 'fredag', startTid: '10:00', sluttTid: '11:30' },
    { fag: 'Idrettsfag', ukedag: 'fredag', startTid: '12:30', sluttTid: '15:00' },
  ];

  let timerCreated = 0;
  for (const time of timeplan) {
    const fagId = createdFag[time.fag];
    if (!fagId) continue;

    const existing = await prisma.skoletime.findFirst({
      where: {
        fagId,
        ukedag: time.ukedag,
        startTid: time.startTid,
      },
    });

    if (!existing) {
      await prisma.skoletime.create({
        data: {
          fagId,
          ukedag: time.ukedag,
          startTid: time.startTid,
          sluttTid: time.sluttTid,
        },
      });
      timerCreated++;
    }
  }
  console.log(`   ✅ Created ${timerCreated} skoletimer`);

  // ============================================
  // OPPGAVER (Assignments)
  // ============================================
  const now = new Date();

  const oppgaver = [
    // Matematikk
    {
      fag: 'Matematikk',
      tittel: 'Kapittel 4 - Funksjoner',
      beskrivelse: 'Løs oppgave 4.1-4.20 i læreboka',
      frist: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      prioritet: 'high',
    },
    {
      fag: 'Matematikk',
      tittel: 'Prøve - Algebra',
      beskrivelse: 'Forberedelse til prøve om algebra og ligninger',
      frist: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      prioritet: 'high',
    },

    // Norsk
    {
      fag: 'Norsk',
      tittel: 'Bokrapport - Doppler',
      beskrivelse: 'Skriv bokrapport på 1000 ord om Doppler av Erlend Loe',
      frist: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      prioritet: 'medium',
    },
    {
      fag: 'Norsk',
      tittel: 'Muntlig presentasjon',
      beskrivelse: 'Forbered 5 min presentasjon om norsk idrett',
      frist: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      prioritet: 'high',
    },

    // Engelsk
    {
      fag: 'Engelsk',
      tittel: 'Essay - Sports in Society',
      beskrivelse: 'Write a 500 word essay about the role of sports in modern society',
      frist: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
      prioritet: 'medium',
    },

    // Naturfag
    {
      fag: 'Naturfag',
      tittel: 'Lab-rapport - Fysikk',
      beskrivelse: 'Skriv rapport fra fysikk-labben om bevegelse og akselerasjon',
      frist: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
      prioritet: 'medium',
    },

    // Samfunnsfag
    {
      fag: 'Samfunnsfag',
      tittel: 'Gruppeprosjekt - Økonomi',
      beskrivelse: 'Forbered presentasjon om norsk økonomi med gruppen',
      frist: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
      prioritet: 'low',
    },

    // Idrettsfag
    {
      fag: 'Idrettsfag',
      tittel: 'Treningsdagbok - Desember',
      beskrivelse: 'Oppdater treningsdagbok med alle økter i desember',
      frist: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      prioritet: 'high',
    },
    {
      fag: 'Idrettsfag',
      tittel: 'Refleksjonsnotat - Sesongmål',
      beskrivelse: 'Skriv refleksjon om sesongmålene og progresjon',
      frist: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      prioritet: 'medium',
    },
    {
      fag: 'Idrettsfag',
      tittel: 'Videoanalyse - Sving',
      beskrivelse: 'Gjør videoanalyse av svinget ditt og identifiser forbedringsområder',
      frist: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
      prioritet: 'high',
    },
  ];

  let oppgaverCreated = 0;
  for (const oppgave of oppgaver) {
    const fagId = createdFag[oppgave.fag];
    if (!fagId) continue;

    const existing = await prisma.oppgave.findFirst({
      where: {
        fagId,
        tittel: oppgave.tittel,
      },
    });

    if (!existing) {
      await prisma.oppgave.create({
        data: {
          fagId,
          tittel: oppgave.tittel,
          beskrivelse: oppgave.beskrivelse,
          frist: oppgave.frist,
          prioritet: oppgave.prioritet,
          status: 'pending',
        },
      });
      oppgaverCreated++;
    }
  }
  console.log(`   ✅ Created ${oppgaverCreated} oppgaver`);
}
