import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import BackToTop from '../ui/BackToTop';
import { tokens } from '../../design-tokens';

// Skip to content link styles
const skipLinkStyles = {
  position: 'absolute',
  top: '-40px',
  left: '0',
  padding: '8px 16px',
  backgroundColor: tokens.colors.primary,
  color: tokens.colors.white,
  textDecoration: 'none',
  fontWeight: '600',
  fontSize: '14px',
  borderRadius: '0 0 8px 0',
  zIndex: 9999,
  transition: 'top 0.2s',
};

const skipLinkFocusStyles = {
  ...skipLinkStyles,
  top: '0',
};

export default function AppShell({ children }) {
  const [skipLinkFocused, setSkipLinkFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      backgroundColor: tokens.colors.snow
    }}>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        style={skipLinkFocused ? skipLinkFocusStyles : skipLinkStyles}
        onFocus={() => setSkipLinkFocused(true)}
        onBlur={() => setSkipLinkFocused(false)}
      >
        Hopp til hovedinnhold
      </a>
      <Sidebar />
      <main
        id="main-content"
        style={{
          flex: 1,
          minWidth: 0,
          marginTop: isMobile ? '60px' : 0,
          backgroundColor: tokens.colors.snow,
        }}
        tabIndex="-1"
      >
        <div style={{
          height: isMobile ? 'calc(100vh - 60px)' : '100vh',
          overflowY: 'auto'
        }}>
          {children}
        </div>
      </main>
      <BackToTop />
    </div>
  );
}
