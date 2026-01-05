/**
 * AK Golf Academy - Coach App Shell
 * Design System v3.0 - Premium Light
 *
 * Layout wrapper for coach portal routes.
 * Uses CoachSidebar for desktop, CoachBottomNav for mobile.
 *
 * LAYOUT:
 * - Desktop: left sidebar (icons + labels) + content area
 * - Mobile: top header + content area + bottom nav (6 items)
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import CoachSidebar from './CoachSidebar';
import BackToTop from '../ui/BackToTop';
import { AKLogo } from '../branding/AKLogo';
import { useAuth } from '../../contexts/AuthContext';
import { coachMobileNavItems } from '../../config/coach-navigation';

const { Menu, X } = LucideIcons;

// Helper to get icon from string name
const getIcon = (iconName: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (LucideIcons as any)[iconName] || LucideIcons.Circle;
};

// Skip to content link styles
const skipLinkStyles: React.CSSProperties = {
  position: 'absolute',
  top: '-40px',
  left: '0',
  padding: '8px 16px',
  backgroundColor: 'var(--ak-primary)',
  color: 'var(--ak-surface-card)',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '14px',
  borderRadius: '0 0 8px 0',
  zIndex: 9999,
  transition: 'top 0.2s',
};

const skipLinkFocusStyles: React.CSSProperties = {
  ...skipLinkStyles,
  top: '0',
};

interface CoachAppShellProps {
  children: React.ReactNode;
}

// Mobile Bottom Navigation Component
function CoachBottomNav({ unreadAlerts }: { unreadAlerts: number }) {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (href: string) => {
    if (href === '/coach') return pathname === '/coach';
    return pathname.startsWith(href);
  };

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: 'var(--ak-primary, #1A3D2E)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 1000,
      }}
    >
      {coachMobileNavItems.map((item) => {
        const Icon = getIcon(item.icon);
        const active = isActive(item.href || '');
        const showBadge = item.badge === 'unreadCount' && unreadAlerts > 0;

        return (
          <Link
            key={item.label}
            to={item.href || '/coach'}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 12px',
              textDecoration: 'none',
              color: active ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
              position: 'relative',
              minWidth: '56px',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={24} />
              {showBadge && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-8px',
                    minWidth: '16px',
                    height: '16px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--ak-status-error)',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                  }}
                >
                  {unreadAlerts > 9 ? '9+' : unreadAlerts}
                </span>
              )}
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: active ? 600 : 400,
              }}
            >
              {item.labelNO}
            </span>
            {active && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '32px',
                  height: '3px',
                  borderRadius: '0 0 3px 3px',
                  backgroundColor: 'var(--ak-achievement, #C9A227)',
                }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

// Mobile Header Component
function CoachMobileHeader({
  onMenuToggle,
  isMenuOpen,
}: {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}) {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: 'var(--ak-primary, #1A3D2E)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 1001,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <AKLogo size={32} color="#FFFFFF" />
        <span style={{ color: 'white', fontWeight: 600, fontSize: '16px' }}>
          AK Golf
        </span>
      </div>

      <button
        onClick={onMenuToggle}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label={isMenuOpen ? 'Lukk meny' : 'Åpne meny'}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </header>
  );
}

export default function CoachAppShell({ children }: CoachAppShellProps) {
  const [skipLinkFocused, setSkipLinkFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadAlerts, setUnreadAlerts] = useState(0);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Fetch unread alerts count
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/v1/coaches/me/alerts?unread=true', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUnreadAlerts(data.data?.alerts?.length || 0);
        }
      } catch {
        // Silent fail - alerts are non-critical
      }
    };

    fetchAlerts();
    // Refresh every 5 minutes
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  // Mobile layout
  if (isMobile) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--ak-surface-page)',
        }}
      >
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          style={skipLinkFocused ? skipLinkFocusStyles : skipLinkStyles}
          onFocus={() => setSkipLinkFocused(true)}
          onBlur={() => setSkipLinkFocused(false)}
        >
          Hopp til hovedinnhold
        </a>

        {/* Mobile Header */}
        <CoachMobileHeader
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMenuOpen={isMobileMenuOpen}
        />

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            <div
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 998,
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <aside
              style={{
                position: 'fixed',
                top: '60px',
                left: 0,
                bottom: '64px',
                width: '300px',
                backgroundColor: 'var(--ak-primary, #1A3D2E)',
                zIndex: 999,
                overflowY: 'auto',
              }}
            >
              <CoachSidebar
                user={user || undefined}
                unreadAlerts={unreadAlerts}
                onLogout={handleLogout}
                isMobileOverlay
              />
            </aside>
          </>
        )}

        {/* Main Content */}
        <main
          id="main-content"
          style={{
            paddingTop: '60px',
            paddingBottom: '80px', // Space for bottom nav
            minHeight: 'calc(100vh - 140px)',
          }}
          tabIndex={-1}
        >
          <div
            style={{
              width: '100%',
              padding: '16px',
            }}
          >
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <CoachBottomNav unreadAlerts={unreadAlerts} />

        <BackToTop />
      </div>
    );
  }

  // Desktop layout
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'var(--ak-surface-page)',
      }}
    >
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        style={skipLinkFocused ? skipLinkFocusStyles : skipLinkStyles}
        onFocus={() => setSkipLinkFocused(true)}
        onBlur={() => setSkipLinkFocused(false)}
      >
        Hopp til hovedinnhold
      </a>

      <CoachSidebar
        user={user || undefined}
        unreadAlerts={unreadAlerts}
        onLogout={handleLogout}
      />

      <main
        id="main-content"
        style={{
          flex: 1,
          minWidth: 0,
        }}
        tabIndex={-1}
      >
        <div
          style={{
            height: '100vh',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              width: '100%',
              padding: '24px 32px',
            }}
          >
            {children}
          </div>
        </div>
      </main>

      <BackToTop />
    </div>
  );
}
