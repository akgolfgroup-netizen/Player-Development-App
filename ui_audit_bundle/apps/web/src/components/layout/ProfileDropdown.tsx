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
import { tokens } from '../../design-tokens';

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
      backgroundColor: tokens.colors.gold,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: tokens.colors.text.primary,
      fontWeight: 700,
      fontSize: '14px',
    },
    name: {
      color: isDark ? tokens.colors.white : tokens.colors.text.primary,
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
      backgroundColor: tokens.colors.white,
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
      border: `1px solid ${tokens.colors.border.default}`,
      overflow: 'hidden',
      zIndex: 1000,
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? 'visible' as const : 'hidden' as const,
      transform: isOpen ? 'translateY(0)' : 'translateY(-8px)',
      transition: 'all 0.2s',
    },
    header: {
      padding: '16px',
      borderBottom: `1px solid ${tokens.colors.border.subtle}`,
    },
    headerName: {
      fontSize: '15px',
      fontWeight: 600,
      color: tokens.colors.text.primary,
      marginBottom: '2px',
    },
    headerEmail: {
      fontSize: '13px',
      color: tokens.colors.text.secondary,
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
      color: tokens.colors.text.primary,
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
      color: tokens.colors.text.secondary,
    },
    divider: {
      height: '1px',
      backgroundColor: tokens.colors.border.subtle,
      margin: '8px 0',
    },
    logoutButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 12px',
      borderRadius: '8px',
      color: tokens.colors.error,
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
                  e.currentTarget.style.backgroundColor = tokens.colors.gray100;
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
