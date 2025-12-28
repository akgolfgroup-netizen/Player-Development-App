/**
 * AK Golf Academy - Coach App Shell
 * Design System v3.0 - Blue Palette 01
 *
 * Layout wrapper for coach portal routes.
 * Uses CoachSidebar for navigation.
 */

import React, { useState, useEffect } from 'react';
import CoachSidebar from './CoachSidebar';
import BackToTop from '../ui/BackToTop';
import { tokens } from '../../design-tokens';
import { useAuth } from '../../contexts/AuthContext';

// Skip to content link styles
const skipLinkStyles: React.CSSProperties = {
  position: 'absolute',
  top: '-40px',
  left: '0',
  padding: '8px 16px',
  backgroundColor: tokens.colors.primary,
  color: tokens.colors.white,
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

export default function CoachAppShell({ children }: CoachAppShellProps) {
  const [skipLinkFocused, setSkipLinkFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [unreadAlerts, setUnreadAlerts] = useState(0);
  const { user, logout } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      } catch (error) {
        // Silent fail - alerts are non-critical
      }
    };

    fetchAlerts();
    // Refresh every 5 minutes
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        backgroundColor: tokens.colors.snow,
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
        user={user}
        unreadAlerts={unreadAlerts}
        onLogout={handleLogout}
      />

      <main
        id="main-content"
        style={{
          flex: 1,
          minWidth: 0,
          marginTop: isMobile ? '60px' : 0,
        }}
        tabIndex={-1}
      >
        <div
          style={{
            height: isMobile ? 'calc(100vh - 60px)' : '100vh',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              padding: isMobile ? '16px' : '24px',
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
