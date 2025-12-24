import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Home, Calendar, Activity, BookOpen } from 'lucide-react';
import { tokens, typographyStyle } from '../../design-tokens';
import { AKLogo } from '../branding/AKLogo';

export default function MobileShell() {
  const navItems = [
    { path: '/m/home', icon: Home, label: 'Hjem' },
    { path: '/m/plan', icon: BookOpen, label: 'Plan' },
    { path: '/m/log', icon: Activity, label: 'Logg' },
    { path: '/m/calendar', icon: Calendar, label: 'Kalender' },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: tokens.colors.snow,
      fontFamily: tokens.typography.fontFamily,
    }}>
      {/* Mobile Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '56px',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        backgroundColor: tokens.colors.primary,
        borderBottom: `1px solid ${tokens.colors.primaryLight}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        boxShadow: tokens.shadows.elevated,
      }}>
        <Link
          to="/"
          aria-label="Gå til Dashboard"
          style={{
            display: 'inline-block',
            padding: '8px',
            borderRadius: '12px',
            transition: 'opacity 0.2s',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          <AKLogo size={40} color={tokens.colors.white} />
        </Link>
      </header>

      <main style={{
        flex: 1,
        paddingTop: 'calc(56px + env(safe-area-inset-top, 0px))',
        paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
        overflowY: 'auto'
      }}>
        <Outlet />
      </main>
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'calc(72px + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        backgroundColor: tokens.colors.surface,
        borderTop: `1px solid ${tokens.colors.mist}`,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: tokens.shadows.elevated,
      }}>
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink key={path} to={path} style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            padding: tokens.spacing.sm,
            textDecoration: 'none',
            color: isActive ? tokens.colors.primary : tokens.colors.steel,
          })}>
            {({ isActive }) => (<>
              <Icon size={24} strokeWidth={isActive ? 2 : 1.5} />
              <span style={{
                ...typographyStyle('caption'),
                fontWeight: isActive ? 600 : 400,
              }}>{label}</span>
            </>)}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
