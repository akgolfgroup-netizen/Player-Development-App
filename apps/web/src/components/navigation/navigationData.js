/**
 * Navigation Data
 *
 * Static navigation structure for the Left Rail + Flyout system.
 * Maps directly to the Information Architecture specification.
 *
 * Structure:
 * - id: Unique identifier for section
 * - label: Display name in rail (short)
 * - icon: Lucide icon name
 * - href: Direct link (if no subsections)
 * - items: Subsection array for flyout
 */

export const navigationSections = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'Home',
    href: '/',
  },
  {
    id: 'utvikling',
    label: 'Utvikling',
    icon: 'TrendingUp',
    items: [
      { href: '/utvikling', label: 'Oversikt' },
      { href: '/utvikling/breaking-points', label: 'Breaking Points' },
      { href: '/utvikling/kategori', label: 'Kategori-fremgang' },
      { href: '/utvikling/benchmark', label: 'Benchmark-historie' },
    ],
  },
  {
    id: 'trening',
    label: 'Trening',
    icon: 'Activity',
    items: [
      { href: '/trening/dagens', label: 'Dagens plan' },
      { href: '/trening/ukens', label: 'Ukens plan' },
      { href: '/trening/dagbok', label: 'Treningsdagbok' },
      { href: '/trening/logg', label: 'Logg trening' },
      { href: '/ovelsesbibliotek', label: 'Ovelsesbank' },
    ],
  },
  {
    id: 'kalender',
    label: 'Kalender',
    icon: 'Calendar',
    items: [
      { href: '/kalender?view=week', label: 'Treningsplan' },
      { href: '/kalender?view=month', label: 'Manedsoversikt' },
      { href: '/kalender?view=year', label: 'Arsplan' },
      { href: '/kalender/booking', label: 'Book trener' },
    ],
  },
  {
    id: 'testing',
    label: 'Testing',
    icon: 'Target',
    items: [
      { href: '/testprotokoll', label: 'Testprotokoll' },
      { href: '/testresultater', label: 'Mine resultater' },
      { href: '/testing/krav', label: 'Kategori-krav' },
      { href: '/testing/registrer', label: 'Registrer test' },
    ],
  },
  {
    id: 'turneringer',
    label: 'Turneringer',
    icon: 'Trophy',
    items: [
      { href: '/turneringskalender', label: 'Kalender' },
      { href: '/mine-turneringer', label: 'Mine turneringer' },
      { href: '/turneringer/resultater', label: 'Resultater' },
      { href: '/turneringer/registrer', label: 'Registrer resultat' },
    ],
  },
  {
    id: 'kommunikasjon',
    label: 'Meldinger',
    icon: 'MessageSquare',
    items: [
      { href: '/meldinger', label: 'Meldinger' },
      { href: '/varsler', label: 'Varsler' },
      { href: '/meldinger/trener', label: 'Fra trener' },
    ],
  },
  {
    id: 'maal',
    label: 'Mal',
    icon: 'Flag',
    items: [
      { href: '/maalsetninger', label: 'Mine mal' },
      { href: '/progress', label: 'Fremgang' },
      { href: '/achievements', label: 'Prestasjoner' },
      { href: '/badges', label: 'Badges' },
    ],
  },
  {
    id: 'kunnskap',
    label: 'Kunnskap',
    icon: 'BookMarked',
    items: [
      { href: '/ressurser', label: 'Ressurser' },
      { href: '/notater', label: 'Notater' },
      { href: '/bevis', label: 'Videobevis' },
      { href: '/arkiv', label: 'Arkiv' },
    ],
  },
  {
    id: 'skole',
    label: 'Skole',
    icon: 'GraduationCap',
    items: [
      { href: '/skoleplan', label: 'Timeplan' },
      { href: '/skole/oppgaver', label: 'Oppgaver' },
    ],
  },
  {
    id: 'innstillinger',
    label: 'Innstillinger',
    icon: 'Settings',
    items: [
      { href: '/profil', label: 'Min profil' },
      { href: '/kalibrering', label: 'Kalibrering' },
      { href: '/trenerteam', label: 'Trenerteam' },
      { href: '/innstillinger/varsler', label: 'Varselinnstillinger' },
    ],
  },
];

/**
 * Get section by ID
 */
export function getSectionById(id) {
  return navigationSections.find(section => section.id === id);
}

/**
 * Get section that contains a given path
 */
export function getSectionByPath(path) {
  return navigationSections.find(section => {
    if (section.href === path) return true;
    if (section.items) {
      return section.items.some(item => path.startsWith(item.href.split('?')[0]));
    }
    return false;
  });
}
