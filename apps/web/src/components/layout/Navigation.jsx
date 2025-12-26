import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, User, Users, Target, Calendar, ClipboardList,
  TrendingUp, Activity, Dumbbell, FileText, Archive, BarChart3, LogOut, BookOpen,
  LineChart, Award, MessageSquare, Video
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { tokens } from '../../design-tokens';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/profil', icon: User, label: 'Brukerprofil' },
    { path: '/trenerteam', icon: Users, label: 'Trenerteam' },
    { path: '/maalsetninger', icon: Target, label: 'Målsetninger' },
    { path: '/aarsplan', icon: Calendar, label: 'Årsplan' },
    { path: '/testprotokoll', icon: ClipboardList, label: 'Testprotokoll' },
    { path: '/testresultater', icon: TrendingUp, label: 'Testresultater' },
    { path: '/treningsprotokoll', icon: Activity, label: 'Treningsprotokoll' },
    { path: '/treningsstatistikk', icon: BarChart3, label: 'Treningsstatistikk' },
    { path: '/progress', icon: LineChart, label: 'Fremdrift', badge: 'NEW' },
    { path: '/achievements', icon: Award, label: 'Prestasjoner', badge: 'NEW' },
    { path: '/videos', icon: Video, label: 'Videoer', badge: 'NEW' },
    { path: '/oevelser', icon: Dumbbell, label: 'Øvelser' },
    { path: '/ovelsesbibliotek', icon: BookOpen, label: 'Øvelsesbibliotek' },
    { path: '/kalender', icon: Calendar, label: 'Kalender' },
    { path: '/notater', icon: FileText, label: 'Notater' },
    { path: '/arkiv', icon: Archive, label: 'Arkiv' },
  ];

  // Coach-only navigation items
  const coachNavItems = user?.role === 'coach' ? [
    { path: '/coach/modification-requests', icon: MessageSquare, label: 'Planendringer', badge: 'NEW' },
  ] : [];

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      width: '240px',
      minHeight: '100vh',
      backgroundColor: tokens.colors.primary,
      padding: '24px 16px',
      position: 'fixed',
      left: 0,
      top: 0,
      overflowY: 'auto',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {[...navItems, ...coachNavItems].map(({ path, icon: Icon, label, badge }) => (
          <Link
            key={path}
            to={path}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: isActive(path) ? tokens.colors.white : tokens.colors.steel,
              backgroundColor: isActive(path) ? tokens.colors.primaryLight : 'transparent',
              transition: 'all 0.2s',
              fontSize: '15px',
              fontWeight: '400',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              if (!isActive(path)) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(path)) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <Icon size={20} strokeWidth={1.5} />
            <span style={{ flex: 1 }}>{label}</span>
            {badge && (
              <span style={{
                fontSize: '10px',
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: tokens.colors.gold,
                color: tokens.colors.white,
              }}>
                {badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* User Info and Logout */}
      <div style={{
        marginTop: 'auto',
        paddingTop: '24px',
        borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
      }}>
        {user && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          }}>
            <div style={{
              fontSize: '15px',
              fontWeight: '600',
              color: tokens.colors.white,
              marginBottom: '4px',
            }}>
              {user.firstName} {user.lastName}
            </div>
            <div style={{
              fontSize: '13px',
              color: tokens.colors.steel,
              marginBottom: '12px',
            }}>
              {user.email}
            </div>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 12px',
                backgroundColor: 'transparent',
                border: `1px solid rgba(255, 255, 255, 0.2)`,
                borderRadius: '6px',
                color: tokens.colors.steel,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <LogOut size={16} />
              <span>Logg ut</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
