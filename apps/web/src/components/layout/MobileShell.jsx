/**
 * MobileShell Component
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Minimal inline styles (dynamic colors)
 */

import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Home, Calendar, Activity, BookOpen } from 'lucide-react';
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
      backgroundColor: 'var(--ak-surface-page)',
      fontFamily: 'var(--ak-font-family)',
    }}>
      {/* Mobile Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '56px',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        backgroundColor: 'var(--ak-brand-primary)',
        borderBottom: '1px solid var(--ak-brand-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        boxShadow: 'var(--ak-shadow-elevated)',
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
          <AKLogo size={40} color="var(--ak-surface-card)" />
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
        backgroundColor: 'var(--ak-surface-card)',
        borderTop: '1px solid var(--ak-border-default)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: 'var(--ak-shadow-elevated)',
      }}>
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink key={path} to={path} style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            padding: '8px',
            textDecoration: 'none',
            color: isActive ? 'var(--ak-brand-primary)' : 'var(--ak-text-secondary)',
          })}>
            {({ isActive }) => (<>
              <Icon size={24} strokeWidth={isActive ? 2 : 1.5} />
              <span style={{
                fontSize: '12px',
                fontWeight: isActive ? 600 : 400,
              }}>{label}</span>
            </>)}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
