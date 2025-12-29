import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, BarChart2, Target } from 'lucide-react';

/**
 * BottomNav
 * Mobile-first bottom tab navigation
 * Uses React Router NavLink for active state
 */

interface NavItem {
  label: string;
  to: string;
  icon?: React.ReactNode;
}

interface BottomNavProps {
  /** Navigation items (defaults to Dashboard/Kalender/Statistikk/Mål) */
  items?: NavItem[];
  /** Additional className */
  className?: string;
}

const defaultItems: NavItem[] = [
  {
    label: 'Dashboard',
    to: '/dashboard-v2',
    icon: <Home size={20} />,
  },
  {
    label: 'Kalender',
    to: '/kalender',
    icon: <Calendar size={20} />,
  },
  {
    label: 'Statistikk',
    to: '/stats',
    icon: <BarChart2 size={20} />,
  },
  {
    label: 'Mål',
    to: '/goals',
    icon: <Target size={20} />,
  },
];

const BottomNav: React.FC<BottomNavProps> = ({
  items = defaultItems,
  className = '',
}) => {
  const location = useLocation();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <nav style={styles.nav} className={className} aria-label="Hovednavigasjon">
      {items.map((item) => {
        const active = isActive(item.to);
        return (
          <NavLink
            key={item.to}
            to={item.to}
            aria-current={active ? 'page' : undefined}
            style={{
              ...styles.navItem,
              ...(active ? styles.navItemActive : {}),
            }}
          >
            <span
              style={{
                ...styles.icon,
                color: active ? 'var(--accent)' : 'var(--text-tertiary)',
              }}
              aria-hidden="true"
            >
              {item.icon}
            </span>
            <span
              style={{
                ...styles.label,
                color: active ? 'var(--accent)' : 'var(--text-tertiary)',
                fontWeight: active ? 600 : 500,
              }}
            >
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
};

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'var(--background-white)',
    borderTop: '1px solid var(--border-subtle)',
    paddingTop: 'var(--spacing-2)',
    paddingBottom: 'calc(var(--spacing-2) + env(safe-area-inset-bottom, 0px))',
    width: '100%',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    padding: 'var(--spacing-1)',
    textDecoration: 'none',
    flex: 1,
    minWidth: 0,
    borderRadius: 'var(--radius-sm)',
    // Focus styles applied via CSS (outline on :focus-visible)
  },
  navItemActive: {
    // Active styling handled inline
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 'var(--font-size-caption2)',
    textAlign: 'center',
  },
};

export default BottomNav;
