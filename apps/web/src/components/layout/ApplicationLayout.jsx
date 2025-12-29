'use client'

import React, { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as LucideIcons from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { navigationConfig } from '../../config/navigation'
import { AKLogo } from '../branding/AKLogo'

import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '../catalyst/sidebar'
import { SidebarLayout } from '../catalyst/sidebar-layout'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '../catalyst/navbar'
import { Avatar } from '../catalyst/avatar'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '../catalyst/dropdown'

const { LogOut, Settings, User, ChevronUp } = LucideIcons

// Helper to get icon from string
const getIcon = (iconName) => {
  return LucideIcons[iconName] || LucideIcons.Circle
}

function AccountDropdownMenu({ anchor, user, onLogout }) {
  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem href="/profile">
        <User data-slot="icon" className="size-4" />
        <DropdownLabel>Min profil</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="/settings">
        <Settings data-slot="icon" className="size-4" />
        <DropdownLabel>Innstillinger</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem onClick={onLogout}>
        <LogOut data-slot="icon" className="size-4" />
        <DropdownLabel>Logg ut</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  )
}

export default function ApplicationLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const pathname = location.pathname

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Filter navigation items based on user role
  const items = useMemo(() => {
    const userRole = user?.role || 'player'
    return navigationConfig.filter(item => {
      if (!item.roles) return true
      return item.roles.includes(userRole)
    }).map(item => ({
      ...item,
      Icon: getIcon(item.icon),
    }))
  }, [user?.role])

  const userInitials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase() || 'U'
  const userName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Bruker'
  const userEmail = user?.email || ''

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar
                  initials={userInitials}
                  className="size-8 bg-[#10456A] text-white text-sm"
                  square
                />
              </DropdownButton>
              <AccountDropdownMenu anchor="bottom end" user={user} onLogout={handleLogout} />
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar className="bg-[#10456A]">
          <SidebarHeader className="border-white/10">
            <div className="flex justify-center py-2">
              <AKLogo size={44} color="#EBE5DA" />
            </div>
          </SidebarHeader>

          <SidebarBody className="[&_[data-slot=section]]:gap-1">
            <SidebarSection>
              {items.map((item) => {
                if (item.submenu) {
                  // For now, render submenu items as flat list
                  return item.submenu.map((subItem) => {
                    const active = pathname === subItem.href
                    return (
                      <SidebarItem key={subItem.href} href={subItem.href} current={active}>
                        <SidebarLabel className="text-white/80 data-[current=true]:text-white">
                          {subItem.label}
                        </SidebarLabel>
                      </SidebarItem>
                    )
                  })
                }

                const active = pathname === item.href
                return (
                  <SidebarItem key={item.href} href={item.href} current={active}>
                    <item.Icon data-slot="icon" className="size-5 text-white/70" />
                    <SidebarLabel className="text-white/80 data-[current=true]:text-white">
                      {item.label}
                    </SidebarLabel>
                  </SidebarItem>
                )
              })}
            </SidebarSection>

            <SidebarSpacer />
          </SidebarBody>

          <SidebarFooter className="border-white/10">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <Avatar
                  initials={userInitials}
                  className="size-8 bg-white/10 text-white text-sm"
                  square
                />
                <SidebarLabel className="text-white/90">{userName}</SidebarLabel>
                <ChevronUp data-slot="icon" className="size-4 text-white/50" />
              </DropdownButton>
              <AccountDropdownMenu anchor="top start" user={user} onLogout={handleLogout} />
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  )
}
