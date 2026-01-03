/**
 * AK Golf Academy - Profile Dropdown
 * Design System v3.0 - Forest Green (Premium Light)
 *
 * Avatar dropdown-meny med profil og innstillinger.
 * Erstatter innstillinger i sidebar.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { settingsMenuItems } from '../../config/player-navigation-v2';

// Design token values (hex for inline styles)
const tokenColors = {
  gold: '#C9A227',
  ink: '#1C1C1E',
  white: '#FFFFFF',
  error: '#C45B4E',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray600: '#4B5563',
};

const { User, LogOut, ChevronDown, Settings } = LucideIcons;

// Helper to get icon from string name
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getIcon = (iconName: string): React.ComponentType<any> => {
  return (LucideIcons as any)[iconName] || LucideIcons.Circle;
};

interface ProfileDropdownProps {
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
  };
  onLogout?: () => void;
  variant?: 'light' | 'dark';
}

export default function ProfileDropdown({
  user,
  onLogout,
  variant = 'dark'
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    if (onLogout) {
      await onLogout();
    }
    navigate('/login');
  };

  const initials = user?.firstName?.[0]?.toUpperCase() || 'S';
  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
    : 'Spiller';

  const isDark = variant === 'dark';

  const styles = {
    container: {
      position: 'relative' as const,
    },
    trigger: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 12px',
      borderRadius: '12px',
      border: 'none',
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: '8px',
      backgroundColor: tokenColors.gold,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: tokenColors.ink,
      fontWeight: 700,
      fontSize: '14px',
    },
    name: {
      color: isDark ? tokenColors.white : tokenColors.ink,
      fontWeight: 500,
      fontSize: '14px',
    },
    chevron: {
      color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.4)',
      transition: 'transform 0.2s',
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    },
    dropdown: {
      position: 'absolute' as const,
      top: 'calc(100% + 8px)',
      right: 0,
      minWidth: '220px',
      backgroundColor: tokenColors.white,
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
      border: `1px solid ${tokenColors.gray300}`,
      overflow: 'hidden',
      zIndex: 1000,
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? 'visible' as const : 'hidden' as const,
      transform: isOpen ? 'translateY(0)' : 'translateY(-8px)',
      transition: 'all 0.2s',
    },
    header: {
      padding: '16px',
      borderBottom: `1px solid ${tokenColors.gray200}`,
    },
    headerName: {
      fontSize: '15px',
      fontWeight: 600,
      color: tokenColors.ink,
      marginBottom: '2px',
    },
    headerEmail: {
      fontSize: '13px',
      color: tokenColors.gray600,
    },
    menuList: {
      padding: '8px',
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 12px',
      borderRadius: '8px',
      textDecoration: 'none',
      color: tokenColors.ink,
      fontSize: '14px',
      fontWeight: 500,
      transition: 'background-color 0.15s',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: 'transparent',
      width: '100%',
      textAlign: 'left' as const,
    },
    menuItemIcon: {
      color: tokenColors.gray600,
    },
    divider: {
      height: '1px',
      backgroundColor: tokenColors.gray200,
      margin: '8px 0',
    },
    logoutButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 12px',
      borderRadius: '8px',
      color: tokenColors.error,
      fontSize: '14px',
      fontWeight: 500,
      transition: 'background-color 0.15s',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: 'transparent',
      width: '100%',
      textAlign: 'left' as const,
    },
  };

  return (
    <div ref={dropdownRef} style={styles.container}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={styles.trigger}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Åpne profilmeny"
      >
        <div style={styles.avatar}>{initials}</div>
        <span style={styles.name}>{displayName}</span>
        <ChevronDown size={16} style={styles.chevron} />
      </button>

      <div
        style={styles.dropdown}
        role="menu"
        aria-label="Profilmeny"
      >
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerName}>{displayName}</div>
          {user?.email && (
            <div style={styles.headerEmail}>{user.email}</div>
          )}
        </div>

        {/* Menu Items */}
        <div style={styles.menuList}>
          {settingsMenuItems.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <Link
                key={item.href}
                to={item.href}
                style={styles.menuItem}
                role="menuitem"
                onClick={() => setIsOpen(false)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = tokenColors.gray100;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div style={styles.divider} />

          <button
            onClick={handleLogout}
            style={styles.logoutButton}
            role="menuitem"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <LogOut size={18} />
            <span>Logg ut</span>
          </button>
        </div>
      </div>
    </div>
  );
}
