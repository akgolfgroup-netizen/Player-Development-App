/**
 * NavigationContext
 *
 * Central state management for the Left Rail + Flyout navigation system.
 * Manages active section, flyout visibility, and mobile drawer state.
 */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NavigationContext = createContext(null);

export function NavigationProvider({ children }) {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(null);
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredSection, setHoveredSection] = useState(null);

  // Determine active section from current pathname
  useEffect(() => {
    const path = location.pathname;

    // Map paths to sections
    if (path === '/') {
      setActiveSection('dashboard');
    } else if (path.startsWith('/utvikling')) {
      setActiveSection('utvikling');
    } else if (path.startsWith('/trening') || path.startsWith('/ovelsesbibliotek')) {
      setActiveSection('trening');
    } else if (path.startsWith('/kalender')) {
      setActiveSection('kalender');
    } else if (path.startsWith('/test')) {
      setActiveSection('testing');
    } else if (path.startsWith('/turnering') || path.startsWith('/mine-turneringer')) {
      setActiveSection('turneringer');
    } else if (path.startsWith('/meldinger') || path.startsWith('/varsler')) {
      setActiveSection('kommunikasjon');
    } else if (path.startsWith('/maalsetninger') || path.startsWith('/progress') || path.startsWith('/achievements') || path.startsWith('/badges')) {
      setActiveSection('maal');
    } else if (path.startsWith('/ressurser') || path.startsWith('/notater') || path.startsWith('/bevis') || path.startsWith('/arkiv')) {
      setActiveSection('kunnskap');
    } else if (path.startsWith('/skole')) {
      setActiveSection('skole');
    } else if (path.startsWith('/profil') || path.startsWith('/kalibrering') || path.startsWith('/trenerteam') || path.startsWith('/innstillinger')) {
      setActiveSection('innstillinger');
    }
  }, [location.pathname]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setFlyoutOpen(false);
  }, [location.pathname]);

  const openFlyout = useCallback((sectionId) => {
    setFlyoutOpen(true);
    setHoveredSection(sectionId);
  }, []);

  const closeFlyout = useCallback(() => {
    setFlyoutOpen(false);
    setHoveredSection(null);
  }, []);

  const toggleMobile = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const value = {
    activeSection,
    flyoutOpen,
    mobileOpen,
    hoveredSection,
    openFlyout,
    closeFlyout,
    toggleMobile,
    closeMobile,
    setHoveredSection,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}

export default NavigationContext;
