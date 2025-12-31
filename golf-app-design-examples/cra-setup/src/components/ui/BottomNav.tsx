import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

interface BottomNavProps {
  items: NavItem[];
  activeId: string;
  onNavigate: (path: string) => void;
}

const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${theme.spacing[16]};
  background-color: ${theme.colors.surface.dark};
  border-top: 1px solid ${theme.colors.surface.border};
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 100;
`;

const NavList = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100%;
  max-height: 64px;
  list-style: none;
  padding: 0 ${theme.spacing[2]};
`;

const NavItemButton = styled.button<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: ${theme.spacing[2]};
  min-width: 64px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ $isActive }) =>
    $isActive ? theme.colors.primary[500] : theme.colors.text.muted};
  transition: color ${theme.transitions.fast};

  &:hover {
    color: ${({ $isActive }) =>
      $isActive ? theme.colors.primary[500] : theme.colors.text.secondary};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const IconWrapper = styled.span`
  font-size: 24px;
  line-height: 1;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const Label = styled.span`
  font-size: ${theme.fontSize.caption};
  font-weight: ${theme.fontWeight.medium};
`;

const ActiveDot = styled.span`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: ${theme.colors.primary[500]};
  margin-top: 2px;
`;

export const BottomNav: React.FC<BottomNavProps> = ({
  items,
  activeId,
  onNavigate,
}) => {
  return (
    <NavContainer>
      <NavList>
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <NavItemButton
                $isActive={isActive}
                onClick={() => onNavigate(item.path)}
                aria-current={isActive ? 'page' : undefined}
              >
                <IconWrapper>{item.icon}</IconWrapper>
                <Label>{item.label}</Label>
                {isActive && <ActiveDot />}
              </NavItemButton>
            </li>
          );
        })}
      </NavList>
    </NavContainer>
  );
};

// Default nav items for the golf app
export const defaultNavItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
      </svg>
    ),
  },
  {
    id: 'stats',
    label: 'Stats',
    path: '/stats',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: 'record',
    label: 'Record',
    path: '/record',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="23,7 16,12 23,17" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    id: 'lessons',
    label: 'Learn',
    path: '/lessons',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Me',
    path: '/profile',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];
