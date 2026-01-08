import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Zap,
  TrendingUp,
  CalendarDays,
  Menu,
  User,
  MessageSquare,
  Settings,
  BookOpen,
  ChevronRight,
  ChevronUp,
  Target,
  ClipboardList,
  BarChart3,
  Video,
  Award,
  Calendar,
  Trophy,
  Flag,
  LogOut
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '../../components/shadcn';
import { useAuth } from '../../contexts/AuthContext';

/**
 * BottomNav
 * Mobile-first bottom tab navigation with 4+1 burger menu structure
 * Features dropdown menus for items with sub-navigation
 *
 * Main tabs: Hjem, Aktivitet, Fremgang, Plan
 * Burger menu: Profil, Meldinger, Innstillinger, Ressurser
 */

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  subItems?: { label: string; to: string; icon: React.ReactNode }[];
}

interface BurgerMenuItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  subItems?: { label: string; to: string }[];
}

interface BottomNavProps {
  /** Additional className */
  className?: string;
}

// Main navigation items (4 tabs) - Consolidated structure
const mainNavItems: NavItem[] = [
  {
    label: 'Hjem',
    to: '/',
    icon: <Home size={20} />,
  },
  {
    label: 'Statistikk',
    to: '/treningsstatistikk',
    icon: <Zap size={20} />,
    subItems: [
      { label: 'Treningsplan', to: '/trening/dagens', icon: <Target size={18} /> },
      { label: 'Treningslogg', to: '/trening/logg', icon: <Zap size={18} /> },
      { label: 'Testing', to: '/testprotokoll', icon: <ClipboardList size={18} /> },
    ],
  },
  {
    label: 'Fremgang',
    to: '/fremgang',
    icon: <TrendingUp size={20} />,
    subItems: [
      { label: 'Statistikk', to: '/stats', icon: <BarChart3 size={18} /> },
      { label: 'Video', to: '/videos', icon: <Video size={18} /> },
      { label: 'Prestasjoner', to: '/achievements', icon: <Award size={18} /> },
    ],
  },
  {
    label: 'Plan',
    to: '/plan',
    icon: <CalendarDays size={20} />,
    subItems: [
      { label: 'Kalender', to: '/kalender', icon: <Calendar size={18} /> },
      { label: 'Turneringer', to: '/turneringskalender', icon: <Trophy size={18} /> },
      { label: 'Mål & Plan', to: '/maalsetninger', icon: <Flag size={18} /> },
    ],
  },
];

// Burger menu items - Consolidated structure
const burgerMenuItems: BurgerMenuItem[] = [
  {
    label: 'Profil',
    to: '/profil',
    icon: <User size={20} />,
    subItems: [
      { label: 'Min profil', to: '/profil' },
      { label: 'Trenerteam', to: '/trenerteam' },
    ],
  },
  {
    label: 'Meldinger',
    to: '/meldinger',
    icon: <MessageSquare size={20} />,
    subItems: [
      { label: 'Innboks', to: '/meldinger' },
      { label: 'Varsler', to: '/varsler' },
    ],
  },
  {
    label: 'Innstillinger',
    to: '/innstillinger',
    icon: <Settings size={20} />,
    subItems: [
      { label: 'Konto', to: '/innstillinger' },
      { label: 'Varsler', to: '/innstillinger/varsler' },
      { label: 'Kalibrering', to: '/kalibrering' },
    ],
  },
  {
    label: 'Ressurser',
    to: '/ressurser',
    icon: <BookOpen size={20} />,
    subItems: [
      { label: 'Bibliotek', to: '/ovelsesbibliotek' },
      { label: 'Notater & Arkiv', to: '/notater' },
    ],
  },
];

const BottomNav: React.FC<BottomNavProps> = ({ className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  const isActive = (path: string, subItems?: { to: string }[]): boolean => {
    if (location.pathname === path) return true;
    if (subItems) {
      return subItems.some(item => location.pathname.startsWith(item.to.split('?')[0]));
    }
    return false;
  };

  const handleSubItemClick = (to: string) => {
    navigate(to);
    setOpenPopover(null);
  };

  const handleMenuItemClick = (to: string) => {
    navigate(to);
    setIsMenuOpen(false);
    setExpandedSection(null);
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const toggleSection = (label: string) => {
    setExpandedSection(expandedSection === label ? null : label);
  };

  // Render a nav item - either simple link or with dropdown
  const renderNavItem = (item: NavItem) => {
    const active = isActive(item.to, item.subItems);
    const hasSubItems = item.subItems && item.subItems.length > 0;

    // Simple link for items without subitems (like Hjem)
    if (!hasSubItems) {
      return (
        <NavLink
          key={item.to}
          to={item.to}
          aria-current={active ? 'page' : undefined}
          style={{
            ...styles.navItem,
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
    }

    // Popover dropdown for items with subitems
    return (
      <Popover
        key={item.to}
        open={openPopover === item.label}
        onOpenChange={(open) => setOpenPopover(open ? item.label : null)}
      >
        <PopoverTrigger asChild>
          <button
            style={styles.navItem}
            aria-expanded={openPopover === item.label}
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
            <ChevronUp
              size={12}
              style={{
                position: 'absolute',
                top: '2px',
                right: '50%',
                transform: `translateX(50%) ${openPopover === item.label ? 'rotate(0deg)' : 'rotate(180deg)'}`,
                color: active ? 'var(--accent)' : 'var(--text-tertiary)',
                opacity: 0.6,
                transition: 'transform 0.2s ease',
              }}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="center"
          sideOffset={8}
          style={styles.popoverContent}
        >
          <div style={styles.popoverHeader}>
            <span style={styles.popoverTitle}>{item.label}</span>
          </div>
          <div style={styles.popoverItems}>
            {item.subItems?.map((subItem) => {
              const subActive = location.pathname === subItem.to ||
                location.pathname.startsWith(subItem.to.split('?')[0]);
              return (
                <button
                  key={subItem.to}
                  onClick={() => handleSubItemClick(subItem.to)}
                  style={{
                    ...styles.popoverItem,
                    ...(subActive ? styles.popoverItemActive : {}),
                  }}
                >
                  <span style={styles.popoverItemIcon}>{subItem.icon}</span>
                  <span style={styles.popoverItemLabel}>{subItem.label}</span>
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <>
      <nav style={styles.nav} className={className} aria-label="Hovednavigasjon">
        {/* Main 4 navigation items */}
        {mainNavItems.map(renderNavItem)}

        {/* Burger menu button */}
        <button
          onClick={() => setIsMenuOpen(true)}
          style={styles.navItem}
          aria-label="Åpne meny"
          aria-expanded={isMenuOpen}
        >
          <span style={{ ...styles.icon, color: 'var(--text-tertiary)' }} aria-hidden="true">
            <Menu size={20} />
          </span>
          <span style={{ ...styles.label, color: 'var(--text-tertiary)', fontWeight: 500 }}>
            Mer
          </span>
        </button>
      </nav>

      {/* Burger menu sheet */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="right" style={styles.sheetContent}>
          <SheetHeader style={styles.sheetHeader}>
            <SheetTitle>Meny</SheetTitle>
          </SheetHeader>

          <div style={styles.menuContent}>
            {/* User info */}
            {user && (
              <div style={styles.userSection}>
                <div style={styles.userAvatar}>
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div style={styles.userInfo}>
                  <span style={styles.userName}>{user.firstName} {user.lastName}</span>
                  <span style={styles.userEmail}>{user.email}</span>
                </div>
              </div>
            )}

            {/* Menu items */}
            <div style={styles.menuItems}>
              {burgerMenuItems.map((item) => (
                <div key={item.label} style={styles.menuSection}>
                  <button
                    onClick={() => item.subItems ? toggleSection(item.label) : handleMenuItemClick(item.to)}
                    style={styles.menuItemHeader}
                  >
                    <span style={styles.menuItemIcon}>{item.icon}</span>
                    <span style={styles.menuItemLabel}>{item.label}</span>
                    {item.subItems && (
                      <ChevronRight
                        size={18}
                        style={{
                          ...styles.chevron,
                          transform: expandedSection === item.label ? 'rotate(90deg)' : 'rotate(0deg)',
                        }}
                      />
                    )}
                  </button>

                  {/* Sub-items */}
                  {item.subItems && expandedSection === item.label && (
                    <div style={styles.subItems}>
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.to}
                          onClick={() => handleMenuItemClick(subItem.to)}
                          style={{
                            ...styles.subItem,
                            ...(location.pathname === subItem.to ? styles.subItemActive : {}),
                          }}
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Logout button */}
            <div style={styles.logoutSection}>
              <button onClick={handleLogout} style={styles.logoutButton}>
                <LogOut size={18} />
                <span>Logg ut</span>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
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
    position: 'relative',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    padding: 'var(--spacing-1)',
    paddingTop: 'var(--spacing-2)',
    textDecoration: 'none',
    flex: 1,
    minWidth: 0,
    borderRadius: 'var(--radius-sm)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
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
  // Popover styles
  popoverContent: {
    padding: 0,
    width: 'auto',
    minWidth: '160px',
  },
  popoverHeader: {
    padding: 'var(--spacing-2) var(--spacing-3)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  popoverTitle: {
    fontSize: 'var(--font-size-caption)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  popoverItems: {
    padding: 'var(--spacing-1)',
  },
  popoverItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-2) var(--spacing-3)',
    width: '100%',
    border: 'none',
    background: 'none',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color 0.15s ease',
  },
  popoverItemActive: {
    backgroundColor: 'var(--accent-subtle)',
  },
  popoverItemIcon: {
    display: 'flex',
    alignItems: 'center',
    color: 'var(--text-secondary)',
  },
  popoverItemLabel: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  // Sheet styles
  sheetContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  sheetHeader: {
    borderBottom: '1px solid var(--border-subtle)',
    paddingBottom: 'var(--spacing-4)',
  },
  menuContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingTop: 'var(--spacing-4)',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-3)',
    backgroundColor: 'var(--background-secondary)',
    borderRadius: 'var(--radius-md)',
    marginBottom: 'var(--spacing-4)',
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: '14px',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  userName: {
    fontWeight: 600,
    fontSize: 'var(--font-size-body)',
    color: 'var(--text-primary)',
  },
  userEmail: {
    fontSize: 'var(--font-size-caption)',
    color: 'var(--text-secondary)',
  },
  menuItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-1)',
    flex: 1,
  },
  menuSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  menuItemHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-3)',
    borderRadius: 'var(--radius-md)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    transition: 'background-color 0.15s ease',
  },
  menuItemIcon: {
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
  },
  menuItemLabel: {
    flex: 1,
    fontSize: 'var(--font-size-body)',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  chevron: {
    color: 'var(--text-tertiary)',
    transition: 'transform 0.2s ease',
  },
  subItems: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 'calc(var(--spacing-3) + 20px + var(--spacing-3))',
    gap: '2px',
  },
  subItem: {
    padding: 'var(--spacing-2) var(--spacing-3)',
    borderRadius: 'var(--radius-sm)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: 'var(--font-size-caption)',
    color: 'var(--text-secondary)',
    transition: 'background-color 0.15s ease, color 0.15s ease',
  },
  subItemActive: {
    backgroundColor: 'var(--accent-subtle)',
    color: 'var(--accent)',
  },
  logoutSection: {
    borderTop: '1px solid var(--border-subtle)',
    paddingTop: 'var(--spacing-4)',
    marginTop: 'auto',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-3)',
    borderRadius: 'var(--radius-md)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    fontSize: 'var(--font-size-body)',
    color: 'var(--error)',
    fontWeight: 500,
  },
};

export default BottomNav;
