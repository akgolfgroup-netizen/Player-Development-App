/**
 * DashboardHeader Component
 *
 * Premium header with flyout navigation menus using Headless UI.
 * Features:
 * - Popover flyout menus with icons and descriptions
 * - Mobile menu with disclosure panels
 * - Dark mode support
 * - Integrated with auth context
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import {
  TrendingUp,
  Activity,
  Calendar,
  Target,
  Trophy,
  BarChart3,
  MessageSquare,
  Flag,
  BookMarked,
  Settings,
  GraduationCap,
  Home,
  Bell,
  Plus,
  User,
  LogOut,
  PlayCircle,
  Phone,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Main navigation categories with flyout menus
const mainNavigation = [
  {
    name: 'Utvikling',
    description: 'Følg din golfutvikling',
    items: [
      {
        name: 'Oversikt',
        description: 'Se din totale utvikling og fremgang',
        href: '/utvikling',
        icon: TrendingUp,
      },
      {
        name: 'Breaking Points',
        description: 'Identifiser kritiske forbedringspunkter',
        href: '/utvikling/breaking-points',
        icon: Target,
      },
      {
        name: 'Kategori-fremgang',
        description: 'Se din vei mot neste kategori',
        href: '/utvikling/kategori',
        icon: Flag,
      },
      {
        name: 'Benchmark',
        description: 'Sammenlign med andre spillere',
        href: '/utvikling/benchmark',
        icon: BarChart3,
      },
    ],
    callsToAction: [
      { name: 'Se demo', href: '#', icon: PlayCircle },
      { name: 'Kontakt trener', href: '/meldinger/trener', icon: Phone },
    ],
  },
  {
    name: 'Trening',
    description: 'Planlegg og logg trening',
    items: [
      {
        name: 'Dagens plan',
        description: 'Se hva som er planlagt i dag',
        href: '/trening/dagens',
        icon: Calendar,
      },
      {
        name: 'Ukens plan',
        description: 'Oversikt over uken',
        href: '/trening/ukens',
        icon: Activity,
      },
      {
        name: 'Treningsdagbok',
        description: 'Logg og reflekter over treninger',
        href: '/trening/dagbok',
        icon: BookMarked,
      },
      {
        name: 'Øvelsesbank',
        description: 'Utforsk øvelser for alle områder',
        href: '/ovelsesbibliotek',
        icon: Target,
      },
    ],
    callsToAction: [
      { name: 'Logg trening', href: '/trening/logg', icon: Plus },
    ],
  },
  {
    name: 'Testing',
    description: 'Test og mål fremgang',
    items: [
      {
        name: 'Testprotokoll',
        description: 'Se alle tilgjengelige tester',
        href: '/testprotokoll',
        icon: Target,
      },
      {
        name: 'Mine resultater',
        description: 'Se dine testresultater over tid',
        href: '/testresultater',
        icon: BarChart3,
      },
      {
        name: 'Kategori-krav',
        description: 'Hva kreves for hver kategori',
        href: '/testing/krav',
        icon: Flag,
      },
    ],
    callsToAction: [
      { name: 'Registrer test', href: '/testing/registrer', icon: Plus },
    ],
  },
  {
    name: 'Statistikk',
    description: 'Analyse og innsikt',
    items: [
      {
        name: 'Oversikt',
        description: 'Samlet statistikk og nøkkeltall',
        href: '/statistikk',
        icon: BarChart3,
      },
      {
        name: 'Strokes Gained',
        description: 'Detaljert SG-analyse mot tour',
        href: '/statistikk/strokes-gained',
        icon: TrendingUp,
      },
      {
        name: 'Alle testresultater',
        description: 'Komplett testhistorikk',
        href: '/statistikk/testresultater',
        icon: Target,
      },
    ],
  },
];

// Simple navigation items (no flyout)
const simpleNavigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Kalender', href: '/kalender' },
  { name: 'Turneringer', href: '/turneringskalender' },
];

// User menu items
const userNavigation = [
  { name: 'Min profil', href: '/profil', icon: User },
  { name: 'Innstillinger', href: '/innstillinger/varsler', icon: Settings },
  { name: 'Logg ut', href: '#', action: 'logout', icon: LogOut },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function DashboardHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleUserNavClick = async (item) => {
    if (item.action === 'logout') {
      await logout();
      navigate('/login');
    } else {
      navigate(item.href);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-4 lg:px-12 xl:px-16"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-3">
            <span className="sr-only">AK Golf Academy</span>
            <img
              src="/logo.svg"
              alt="AK Golf"
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300"
          >
            <span className="sr-only">Åpne meny</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>

        {/* Desktop navigation */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-8">
          {/* Simple links */}
          {simpleNavigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm/6 font-semibold text-gray-900 hover:text-[var(--accent)] dark:text-white dark:hover:text-[var(--accent)] transition-colors"
            >
              {item.name}
            </Link>
          ))}

          {/* Flyout menus */}
          {mainNavigation.map((category) => (
            <Popover key={category.name} className="relative">
              <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 hover:text-[var(--accent)] dark:text-white dark:hover:text-[var(--accent)] outline-none transition-colors">
                {category.name}
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-4 flex-none text-gray-400"
                />
              </PopoverButton>

              <PopoverPanel
                transition
                className="absolute -left-8 top-full z-50 mt-3 w-screen max-w-md overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in dark:bg-gray-800 dark:ring-white/10"
              >
                <div className="p-4">
                  {category.items.map((item) => (
                    <div
                      key={item.name}
                      className="group relative flex items-center gap-x-4 rounded-lg p-3 text-sm/6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex size-10 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white dark:bg-gray-700 dark:group-hover:bg-gray-600">
                        <item.icon
                          aria-hidden="true"
                          className="size-5 text-gray-600 group-hover:text-[var(--accent)] dark:text-gray-400 dark:group-hover:text-white transition-colors"
                        />
                      </div>
                      <div className="flex-auto">
                        <Link
                          to={item.href}
                          className="block font-semibold text-gray-900 dark:text-white"
                        >
                          {item.name}
                          <span className="absolute inset-0" />
                        </Link>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calls to action */}
                {category.callsToAction && category.callsToAction.length > 0 && (
                  <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50 dark:divide-white/10 dark:bg-gray-700/50">
                    {category.callsToAction.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 transition-colors"
                      >
                        <item.icon
                          aria-hidden="true"
                          className="size-5 flex-none text-gray-400"
                        />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </PopoverPanel>
            </Popover>
          ))}
        </PopoverGroup>

        {/* Desktop right section */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4">
          {/* Notifications */}
          <Link
            to="/varsler"
            className="relative rounded-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
          >
            <span className="sr-only">Vis varsler</span>
            <Bell className="size-5" />
          </Link>

          {/* User menu */}
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]">
              {user?.avatarUrl ? (
                <img
                  alt=""
                  src={user.avatarUrl}
                  className="size-8 rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
                />
              ) : (
                <div className="size-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-sm font-medium">
                  {getInitials(user?.name || user?.email)}
                </div>
              )}
              <ChevronDownIcon className="size-4 text-gray-400" />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute right-0 z-50 mt-3 w-56 origin-top-right rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in dark:bg-gray-800 dark:ring-white/10"
            >
              {/* User info */}
              <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 mb-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user?.name || 'Bruker'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>

              {userNavigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleUserNavClick(item)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  <item.icon className="size-4" />
                  {item.name}
                </button>
              ))}
            </PopoverPanel>
          </Popover>
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50 bg-black/20" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:bg-gray-900 dark:ring-white/10">
          {/* Mobile header */}
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="-m-1.5 p-1.5 flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img
                src="/logo.svg"
                alt="AK Golf"
                className="h-8 w-auto"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-400"
            >
              <span className="sr-only">Lukk meny</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>

          {/* Mobile navigation */}
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10 dark:divide-white/10">
              <div className="space-y-2 py-6">
                {/* Simple links */}
                {simpleNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Flyout categories as disclosures */}
                {mainNavigation.map((category) => (
                  <Disclosure key={category.name} as="div" className="-mx-3">
                    <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5">
                      {category.name}
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="size-5 flex-none group-data-open:rotate-180 transition-transform"
                      />
                    </DisclosureButton>
                    <DisclosurePanel className="mt-2 space-y-2">
                      {category.items.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block rounded-lg py-2 pl-6 pr-3 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                        >
                          {item.name}
                        </Link>
                      ))}
                      {category.callsToAction?.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 rounded-lg py-2 pl-6 pr-3 text-sm/7 font-semibold text-[var(--accent)] hover:bg-gray-50 dark:hover:bg-white/5"
                        >
                          <item.icon className="size-4" />
                          {item.name}
                        </Link>
                      ))}
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </div>

              {/* Mobile user section */}
              <div className="py-6">
                <div className="flex items-center gap-3 px-3 py-2 mb-4">
                  {user?.avatarUrl ? (
                    <img
                      alt=""
                      src={user.avatarUrl}
                      className="size-10 rounded-full"
                    />
                  ) : (
                    <div className="size-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-medium">
                      {getInitials(user?.name || user?.email)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {user?.name || 'Bruker'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {userNavigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleUserNavClick(item)}
                    className="-mx-3 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                  >
                    <item.icon className="size-5" />
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}

export default DashboardHeader;
