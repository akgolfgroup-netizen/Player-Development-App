/**
 * Navigation Data
 *
 * 4+1 Navigation Structure (Mobile-first)
 *
 * Main Navigation (Bottom Bar):
 * 1. Hjem - Dashboard
 * 2. Aktivitet - Trening + Testing (aktive handlinger)
 * 3. Fremgang - Statistikk + Utvikling + Video (måling)
 * 4. Plan - Kalender + Turneringer + Mål + Årsplan
 *
 * Burger Menu (☰):
 * - Profil
 * - Meldinger
 * - Innstillinger
 * - Ressurser
 */

export const navigationSections = [
  // === MAIN NAVIGATION (4 tabs) ===
  {
    id: 'hjem',
    label: 'Hjem',
    icon: 'Home',
    href: '/',
    isMainNav: true,
  },
  {
    id: 'aktivitet',
    label: 'Aktivitet',
    icon: 'Zap',
    isMainNav: true,
    items: [
      { href: '/trening/dagens', label: 'Dagens plan' },
      { href: '/trening/ukens', label: 'Ukens plan' },
      { href: '/trening/logg', label: 'Logg trening' },
      { href: '/trening/dagbok', label: 'Treningsdagbok' },
      { href: '/testprotokoll', label: 'Testprotokoll' },
      { href: '/testresultater', label: 'Testresultater' },
      { href: '/testing/registrer', label: 'Registrer test' },
    ],
  },
  {
    id: 'fremgang',
    label: 'Fremgang',
    icon: 'TrendingUp',
    isMainNav: true,
    items: [
      { href: '/stats', label: 'Statistikk' },
      { href: '/utvikling', label: 'Utvikling' },
      { href: '/utvikling/breaking-points', label: 'Breaking Points' },
      { href: '/utvikling/kategori', label: 'Kategori-fremgang' },
      { href: '/videos', label: 'Videoer' },
      { href: '/bevis', label: 'Videobevis' },
      { href: '/achievements', label: 'Prestasjoner' },
      { href: '/badges', label: 'Badges' },
      { href: '/progress', label: 'Fremdrift' },
    ],
  },
  {
    id: 'plan',
    label: 'Plan',
    icon: 'CalendarDays',
    isMainNav: true,
    items: [
      { href: '/kalender', label: 'Kalender' },
      { href: '/kalender?view=week', label: 'Ukesoversikt' },
      { href: '/kalender?view=month', label: 'Månedsoversikt' },
      { href: '/turneringskalender', label: 'Turneringskalender' },
      { href: '/mine-turneringer', label: 'Mine turneringer' },
      { href: '/maalsetninger', label: 'Mål' },
      { href: '/aarsplan', label: 'Årsplan' },
      { href: '/kalender/booking', label: 'Book trener' },
    ],
  },

  // === BURGER MENU (☰) ===
  {
    id: 'profil',
    label: 'Profil',
    icon: 'User',
    isBurgerMenu: true,
    items: [
      { href: '/profil', label: 'Min profil' },
      { href: '/trenerteam', label: 'Trenerteam' },
      { href: '/kalibrering', label: 'Kalibrering' },
    ],
  },
  {
    id: 'meldinger',
    label: 'Meldinger',
    icon: 'MessageSquare',
    isBurgerMenu: true,
    items: [
      { href: '/meldinger', label: 'Innboks' },
      { href: '/varsler', label: 'Varsler' },
      { href: '/meldinger/trener', label: 'Fra trener' },
    ],
  },
  {
    id: 'innstillinger',
    label: 'Innstillinger',
    icon: 'Settings',
    isBurgerMenu: true,
    items: [
      { href: '/innstillinger', label: 'Kontoinnstillinger' },
      { href: '/innstillinger/varsler', label: 'Varselinnstillinger' },
    ],
  },
  {
    id: 'ressurser',
    label: 'Ressurser',
    icon: 'BookOpen',
    isBurgerMenu: true,
    items: [
      { href: '/ovelsesbibliotek', label: 'Øvelsesbibliotek' },
      { href: '/ressurser', label: 'Ressurser' },
      { href: '/notater', label: 'Notater' },
      { href: '/arkiv', label: 'Arkiv' },
    ],
  },

  // === LEGACY/ADDITIONAL SECTIONS ===
  {
    id: 'skole',
    label: 'Skole',
    icon: 'GraduationCap',
    isBurgerMenu: true,
    items: [
      { href: '/skoleplan', label: 'Timeplan' },
      { href: '/skole/oppgaver', label: 'Oppgaver' },
    ],
  },
];

/**
 * Get main navigation items (4 tabs)
 */
export function getMainNavItems() {
  return navigationSections.filter(section => section.isMainNav);
}

/**
 * Get burger menu items
 */
export function getBurgerMenuItems() {
  return navigationSections.filter(section => section.isBurgerMenu);
}

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

/**
 * Flat list of all navigation items for search/autocomplete
 */
export function getAllNavigationItems() {
  const items = [];
  navigationSections.forEach(section => {
    if (section.href) {
      items.push({
        href: section.href,
        label: section.label,
        section: section.id,
        icon: section.icon,
      });
    }
    if (section.items) {
      section.items.forEach(item => {
        items.push({
          href: item.href,
          label: item.label,
          section: section.id,
          sectionLabel: section.label,
          icon: section.icon,
        });
      });
    }
  });
  return items;
}
