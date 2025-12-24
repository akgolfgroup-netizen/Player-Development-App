import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { tokens } from '../../design-tokens';
import ConfirmDialog from '../ui/ConfirmDialog';
import { AKLogo } from '../branding/AKLogo';
import { navigationConfig } from '../../config/navigation';

const { LogOut, ChevronDown, ChevronRight, Menu, X } = LucideIcons;

// Hjelpefunksjon for å hente ikon fra streng
const getIcon = (iconName) => {
  return LucideIcons[iconName] || LucideIcons.Circle;
};

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const pathname = location.pathname;
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Filtrer navigasjonselementer basert på brukerrolle
  const items = useMemo(() => {
    const userRole = user?.role || 'player';
    return navigationConfig.filter(item => {
      if (!item.roles) return true; // Vis for alle hvis ingen rolle er spesifisert
      return item.roles.includes(userRole);
    }).map(item => ({
      ...item,
      Icon: getIcon(item.icon),
    }));
  }, [user?.role]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Mobile header with hamburger menu
  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          backgroundColor: tokens.colors.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 1000,
        }}>
          <Link
            to="/"
            aria-label="Gå til Dashboard"
            style={{
              display: 'inline-block',
              padding: '4px',
              borderRadius: '8px',
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
            <AKLogo size={36} color={tokens.colors.white} />
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: tokens.colors.white,
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
            }}
            aria-label={isMobileMenuOpen ? 'Lukk meny' : 'Åpne meny'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 998,
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Slide-out Menu */}
        <aside style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          bottom: 0,
          width: '280px',
          backgroundColor: tokens.colors.primary,
          color: tokens.colors.white,
          display: 'flex',
          flexDirection: 'column',
          transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
          zIndex: 999,
          overflowY: 'auto',
        }}>
          <div style={{ padding: '16px 12px', flex: 1 }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }} aria-label="Hovednavigasjon">
              {renderNavItems()}
            </nav>
          </div>
          {renderUserSection()}
        </aside>

        {/* Logout Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={handleLogout}
          title="Logg ut"
          message="Er du sikker på at du vil logge ut av AK Golf Academy?"
          confirmLabel="Logg ut"
          cancelLabel="Avbryt"
          variant="warning"
        />
      </>
    );
  }

  // Helper function to render nav items (used in both mobile and desktop)
  function renderNavItems() {
    return items.map((item) => {
      if (item.submenu) {
        const isOpen = openSubmenus[item.label] || false;
        const hasActiveChild = item.submenu.some(sub => pathname === sub.href);

        return (
          <div key={item.label}>
            <button
              onClick={() => setOpenSubmenus({...openSubmenus, [item.label]: !isOpen})}
              aria-expanded={isOpen}
              aria-controls={`submenu-${item.label.toLowerCase().replace(/\s/g, '-')}`}
              aria-label={`${item.label} undermeny`}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                borderRadius: '16px',
                padding: '12px 16px',
                textDecoration: 'none',
                color: hasActiveChild ? tokens.colors.white : 'rgba(255, 255, 255, 0.75)',
                backgroundColor: hasActiveChild ? tokens.colors.primaryLight : 'transparent',
                transition: 'all 0.2s',
                fontSize: '15px',
                fontWeight: 500,
                userSelect: 'none',
                outline: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!hasActiveChild) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = tokens.colors.white;
                }
              }}
              onMouseLeave={(e) => {
                if (!hasActiveChild) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
                }
              }}
            >
              <item.Icon size={20} style={{ color: hasActiveChild ? tokens.colors.white : 'rgba(255, 255, 255, 0.75)' }} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {isOpen && (
              <div
                id={`submenu-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                style={{ marginLeft: '32px', marginTop: '4px', marginBottom: '4px' }}
                role="menu"
              >
                {item.submenu.map(subItem => {
                  const active = pathname === subItem.href;
                  return (
                    <Link
                      key={subItem.href}
                      to={subItem.href}
                      role="menuitem"
                      aria-current={active ? 'page' : undefined}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        borderRadius: '12px',
                        padding: '8px 12px',
                        textDecoration: 'none',
                        color: active ? tokens.colors.white : 'rgba(255, 255, 255, 0.65)',
                        backgroundColor: active ? `${tokens.colors.primaryLight}80` : 'transparent',
                        transition: 'all 0.2s',
                        fontSize: '14px',
                        fontWeight: 400,
                      }}
                    >
                      {subItem.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      } else {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            aria-current={active ? 'page' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderRadius: '16px',
              padding: '12px 16px',
              textDecoration: 'none',
              color: active ? tokens.colors.white : 'rgba(255, 255, 255, 0.75)',
              backgroundColor: active ? tokens.colors.primaryLight : 'transparent',
              transition: 'all 0.2s',
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            <item.Icon size={20} style={{ color: active ? tokens.colors.white : 'rgba(255, 255, 255, 0.75)' }} />
            <span style={{ flex: 1 }}>{item.label}</span>
          </Link>
        );
      }
    });
  }

  // Helper function to render user section
  function renderUserSection() {
    return (
      <div style={{ padding: '0 16px 24px' }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          borderRadius: '16px',
          padding: '16px'
        }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: tokens.colors.white }}>
            {user?.firstName || 'Jørn'} {user?.lastName || 'Johnsen'}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)', marginTop: '2px' }}>
            {user?.email || 'jorn@akgolf.no'}
          </div>
          <button
            style={{
              marginTop: '12px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              backgroundColor: 'transparent',
              padding: '10px 12px',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.75)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onClick={() => setShowLogoutConfirm(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = tokens.colors.white;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
            }}
          >
            <LogOut size={16} />
            <span>Logg ut</span>
          </button>
        </div>
      </div>
    );
  }

  // Desktop sidebar
  return (
    <>
      <aside style={{
        width: '280px',
        height: '100vh',
        backgroundColor: tokens.colors.primary,
        color: tokens.colors.white,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0
      }}>
        <div style={{
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <Link
            to="/"
            aria-label="Gå til Dashboard"
            style={{
              display: 'inline-block',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
              textDecoration: 'none',
              borderRadius: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <AKLogo size={44} color={tokens.colors.ivory} />
          </Link>
        </div>

        <div style={{
          padding: '0 12px',
          flex: 1,
          overflowY: 'auto'
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }} aria-label="Hovednavigasjon">
            {renderNavItems()}
          </nav>
          <div style={{
            margin: '20px 0',
            height: '1px',
            backgroundColor: 'rgba(255, 255, 255, 0.10)'
          }} />
        </div>

        {renderUserSection()}
      </aside>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Logg ut"
        message="Er du sikker på at du vil logge ut av AK Golf Academy?"
        confirmLabel="Logg ut"
        cancelLabel="Avbryt"
        variant="warning"
      />
    </>
  );
}
