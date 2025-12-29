/**
 * AK Golf Academy - Main Application Layout
 *
 * Uses Catalyst SidebarLayout with AK Golf styling.
 * Provides consistent navigation and structure across the app.
 */

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  SidebarLayout,
  Sidebar,
  SidebarHeader,
  SidebarBody,
  SidebarFooter,
  SidebarSection,
  SidebarItem,
  SidebarLabel,
  SidebarDivider,
  SidebarSpacer,
  Navbar,
  NavbarSection,
  NavbarSpacer,
  NavbarItem,
  Avatar,
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  DropdownDivider,
} from '../ui';
import {
  Home,
  Target,
  Trophy,
  Calendar,
  BookOpen,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Menu,
} from 'lucide-react';

// Navigation items for players
const playerNavItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Min Utvikling', href: '/progress', icon: Target },
  { name: 'Mål', href: '/goals', icon: Trophy },
  { name: 'Kalender', href: '/calendar', icon: Calendar },
  { name: 'Trening', href: '/training', icon: BookOpen },
];

// Navigation items for coaches
const coachNavItems = [
  { name: 'Dashboard', href: '/coach/dashboard', icon: Home },
  { name: 'Mine Spillere', href: '/coach/athletes', icon: User },
  { name: 'Treningsplaner', href: '/coach/training-plans', icon: BookOpen },
  { name: 'Kalender', href: '/coach/calendar', icon: Calendar },
];

export default function AppLayout({ children, userRole = 'player', user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = userRole === 'coach' ? coachNavItems : playerNavItems;

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/login');
  };

  return (
    <SidebarLayout
      navbar={
        <Navbar className="bg-white dark:bg-[#1C1C1E] border-b border-[#D5D7DA] dark:border-[#3A3A3C]">
          <NavbarSpacer />
          <NavbarSection>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar
                  src={user?.avatar}
                  initials={user?.name?.charAt(0) || 'U'}
                  className="size-8 bg-[#10456A] text-white"
                />
                <span className="ml-2 hidden sm:inline text-[#02060D] dark:text-white">
                  {user?.name || 'Bruker'}
                </span>
                <ChevronDown className="ml-1 size-4 text-[#8E8E93]" />
              </DropdownButton>
              <DropdownMenu anchor="bottom end" className="min-w-48">
                <DropdownItem href="/profile">
                  <User className="size-4" />
                  <span>Min Profil</span>
                </DropdownItem>
                <DropdownItem href="/settings">
                  <Settings className="size-4" />
                  <span>Innstillinger</span>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem onClick={handleLogout}>
                  <LogOut className="size-4" />
                  <span>Logg ut</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar className="bg-white dark:bg-[#1C1C1E]">
          <SidebarHeader>
            <div className="flex items-center gap-3 px-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10456A]">
                <span className="font-logo text-lg font-bold text-white">AK</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#02060D] dark:text-white">
                  AK Golf Academy
                </p>
                <p className="text-xs text-[#8E8E93]">
                  {userRole === 'coach' ? 'Trener' : 'Spiller'}
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              {navItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  href={item.href}
                  current={location.pathname === item.href}
                >
                  <item.icon className="size-5" data-slot="icon" />
                  <SidebarLabel>{item.name}</SidebarLabel>
                </SidebarItem>
              ))}
            </SidebarSection>

            <SidebarSpacer />

            <SidebarSection>
              <SidebarItem href="/settings">
                <Settings className="size-5" data-slot="icon" />
                <SidebarLabel>Innstillinger</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>

          <SidebarFooter>
            <SidebarSection>
              <SidebarItem onClick={handleLogout}>
                <LogOut className="size-5" data-slot="icon" />
                <SidebarLabel>Logg ut</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarFooter>
        </Sidebar>
      }
    >
      <main className="min-h-screen bg-[#EDF0F2] dark:bg-[#1C1C1E]">
        {children}
      </main>
    </SidebarLayout>
  );
}
