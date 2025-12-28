import React, { useState } from 'react';
import {
  Settings,
  User,
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  Camera,
  Mail,
  Phone,
  Save,
  ChevronRight,
  Check
} from 'lucide-react';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';

interface CoachProfile {
  name: string;
  email: string;
  phone: string;
  title: string;
  bio: string;
  avatar?: string;
}

interface NotificationSettings {
  newBooking: boolean;
  bookingReminder: boolean;
  playerUpdate: boolean;
  tournamentResults: boolean;
  systemUpdates: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

interface DisplaySettings {
  theme: 'light' | 'dark' | 'system';
  language: 'no' | 'en';
  compactView: boolean;
  showPlayerPhotos: boolean;
}

export const CoachSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'display' | 'privacy'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [profile, setProfile] = useState<CoachProfile>({
    name: 'Anders Kristiansen',
    email: 'anders@akgolfacademy.no',
    phone: '+47 900 00 000',
    title: 'Hovedtrener',
    bio: 'PGA-sertifisert trener med over 15 års erfaring. Spesialiserer meg i junior- og eliteutvikling.',
    avatar: undefined
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    newBooking: true,
    bookingReminder: true,
    playerUpdate: true,
    tournamentResults: true,
    systemUpdates: false,
    emailNotifications: true,
    pushNotifications: true
  });

  const [display, setDisplay] = useState<DisplaySettings>({
    theme: 'light',
    language: 'no',
    compactView: false,
    showPlayerPhotos: true
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const tabs = [
    { key: 'profile', label: 'Profil', icon: User },
    { key: 'notifications', label: 'Varsler', icon: Bell },
    { key: 'display', label: 'Visning', icon: Sun },
    { key: 'privacy', label: 'Personvern', icon: Shield }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${'var(--accent)'}, ${'var(--accent)'})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Settings size={24} color="white" />
          </div>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              Innstillinger
            </h1>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              Administrer din profil og preferanser
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Sidebar Navigation */}
        <div style={{
          width: '240px',
          flexShrink: 0
        }}>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '16px',
            border: `1px solid ${'var(--border-default)'}`,
            overflow: 'hidden'
          }}>
            {tabs.map(tab => {
              const isActive = activeTab === tab.key;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: 'none',
                    backgroundColor: isActive ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    borderLeft: isActive ? `3px solid ${'var(--accent)'}` : '3px solid transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon
                    size={18}
                    color={isActive ? 'var(--accent)' : 'var(--text-secondary)'}
                  />
                  <span style={{
                    fontSize: '14px',
                    fontWeight: isActive ? '600' : '500',
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)'
                  }}>
                    {tab.label}
                  </span>
                  <ChevronRight
                    size={16}
                    color={'var(--text-tertiary)'}
                    style={{ marginLeft: 'auto', opacity: isActive ? 1 : 0 }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1 }}>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '16px',
            border: `1px solid ${'var(--border-default)'}`,
            padding: '24px'
          }}>
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: '0 0 20px 0'
                }}>
                  Profilinformasjon
                </h2>

                {/* Avatar */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(var(--accent-rgb), 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      fontWeight: '600',
                      color: 'var(--accent)'
                    }}>
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: `1px solid ${'var(--border-default)'}`,
                        backgroundColor: 'transparent',
                        color: 'var(--text-secondary)',
                        fontSize: '13px',
                        cursor: 'pointer',
                        marginBottom: '6px'
                      }}>
                        <Camera size={14} />
                        Last opp bilde
                      </button>
                      <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>
                        JPG, PNG maks 2MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: 'var(--text-secondary)',
                      marginBottom: '6px'
                    }}>
                      Fullt navn
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: `1px solid ${'var(--border-default)'}`,
                        fontSize: '14px',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: 'var(--text-secondary)',
                      marginBottom: '6px'
                    }}>
                      Tittel
                    </label>
                    <input
                      type="text"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: `1px solid ${'var(--border-default)'}`,
                        fontSize: '14px',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: 'var(--text-secondary)',
                      marginBottom: '6px'
                    }}>
                      <Mail size={12} style={{ marginRight: '6px' }} />
                      E-post
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: `1px solid ${'var(--border-default)'}`,
                        fontSize: '14px',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: 'var(--text-secondary)',
                      marginBottom: '6px'
                    }}>
                      <Phone size={12} style={{ marginRight: '6px' }} />
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: `1px solid ${'var(--border-default)'}`,
                        fontSize: '14px',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                    marginBottom: '6px'
                  }}>
                    Bio / Beskrivelse
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${'var(--border-default)'}`,
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: '0 0 20px 0'
                }}>
                  Varslingsinnstillinger
                </h2>

                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                    margin: '0 0 12px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Aktivitetsvarsler
                  </h3>
                  {[
                    { key: 'newBooking', label: 'Nye bookingforespørsler', desc: 'Når en spiller ber om en økt' },
                    { key: 'bookingReminder', label: 'Bookingpåminnelser', desc: '24 timer før planlagte økter' },
                    { key: 'playerUpdate', label: 'Spilleroppdateringer', desc: 'Når spillere logger trening eller tester' },
                    { key: 'tournamentResults', label: 'Turneringsresultater', desc: 'Når spillere registrerer resultater' },
                    { key: 'systemUpdates', label: 'Systemoppdateringer', desc: 'Nyheter og oppdateringer fra plattformen' }
                  ].map(item => (
                    <div key={item.key} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 0',
                      borderBottom: `1px solid ${'var(--border-default)'}`
                    }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', margin: 0 }}>
                          {item.label}
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '2px 0 0' }}>
                          {item.desc}
                        </p>
                      </div>
                      <button
                        onClick={() => setNotifications({
                          ...notifications,
                          [item.key]: !notifications[item.key as keyof NotificationSettings]
                        })}
                        style={{
                          width: '48px',
                          height: '26px',
                          borderRadius: '13px',
                          border: 'none',
                          backgroundColor: notifications[item.key as keyof NotificationSettings]
                            ? 'var(--accent)'
                            : 'var(--border-default)',
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          backgroundColor: 'white',
                          position: 'absolute',
                          top: '2px',
                          left: notifications[item.key as keyof NotificationSettings] ? '24px' : '2px',
                          transition: 'left 0.2s ease',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }} />
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                    margin: '0 0 12px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Leveringsmetode
                  </h3>
                  {[
                    { key: 'emailNotifications', label: 'E-postvarsler', icon: Mail },
                    { key: 'pushNotifications', label: 'Push-varsler', icon: Bell }
                  ].map(item => (
                    <div key={item.key} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 0',
                      borderBottom: `1px solid ${'var(--border-default)'}`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <item.icon size={18} color={'var(--text-secondary)'} />
                        <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
                          {item.label}
                        </span>
                      </div>
                      <button
                        onClick={() => setNotifications({
                          ...notifications,
                          [item.key]: !notifications[item.key as keyof NotificationSettings]
                        })}
                        style={{
                          width: '48px',
                          height: '26px',
                          borderRadius: '13px',
                          border: 'none',
                          backgroundColor: notifications[item.key as keyof NotificationSettings]
                            ? 'var(--accent)'
                            : 'var(--border-default)',
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          backgroundColor: 'white',
                          position: 'absolute',
                          top: '2px',
                          left: notifications[item.key as keyof NotificationSettings] ? '24px' : '2px',
                          transition: 'left 0.2s ease',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Display Tab */}
            {activeTab === 'display' && (
              <div>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: '0 0 20px 0'
                }}>
                  Visningsinnstillinger
                </h2>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                    marginBottom: '10px'
                  }}>
                    Tema
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {[
                      { key: 'light', label: 'Lyst', icon: Sun },
                      { key: 'dark', label: 'Mørkt', icon: Moon },
                      { key: 'system', label: 'System', icon: Settings }
                    ].map(option => {
                      const isSelected = display.theme === option.key;
                      return (
                        <button
                          key={option.key}
                          onClick={() => setDisplay({ ...display, theme: option.key as DisplaySettings['theme'] })}
                          style={{
                            flex: 1,
                            padding: '16px',
                            borderRadius: '12px',
                            border: isSelected
                              ? `2px solid ${'var(--accent)'}`
                              : `1px solid ${'var(--border-default)'}`,
                            backgroundColor: isSelected
                              ? 'rgba(var(--accent-rgb), 0.1)'
                              : 'transparent',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          <option.icon
                            size={24}
                            color={isSelected ? 'var(--accent)' : 'var(--text-secondary)'}
                          />
                          <span style={{
                            fontSize: '14px',
                            fontWeight: isSelected ? '600' : '500',
                            color: isSelected ? 'var(--accent)' : 'var(--text-secondary)'
                          }}>
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                    marginBottom: '10px'
                  }}>
                    <Globe size={14} style={{ marginRight: '6px' }} />
                    Språk
                  </label>
                  <select
                    value={display.language}
                    onChange={(e) => setDisplay({ ...display, language: e.target.value as DisplaySettings['language'] })}
                    style={{
                      width: '200px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${'var(--border-default)'}`,
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="no">Norsk</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                    margin: '0 0 12px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Visningsalternativer
                  </h3>
                  {[
                    { key: 'compactView', label: 'Kompakt visning', desc: 'Vis mer innhold med mindre mellomrom' },
                    { key: 'showPlayerPhotos', label: 'Vis spillerbilder', desc: 'Vis profilbilder i lister' }
                  ].map(item => (
                    <div key={item.key} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 0',
                      borderBottom: `1px solid ${'var(--border-default)'}`
                    }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', margin: 0 }}>
                          {item.label}
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '2px 0 0' }}>
                          {item.desc}
                        </p>
                      </div>
                      <button
                        onClick={() => setDisplay({
                          ...display,
                          [item.key]: !display[item.key as keyof DisplaySettings]
                        })}
                        style={{
                          width: '48px',
                          height: '26px',
                          borderRadius: '13px',
                          border: 'none',
                          backgroundColor: display[item.key as keyof DisplaySettings]
                            ? 'var(--accent)'
                            : 'var(--border-default)',
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          backgroundColor: 'white',
                          position: 'absolute',
                          top: '2px',
                          left: display[item.key as keyof DisplaySettings] ? '24px' : '2px',
                          transition: 'left 0.2s ease',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: '0 0 20px 0'
                }}>
                  Personvern og sikkerhet
                </h2>

                <div style={{
                  padding: '16px',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '12px',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <Shield size={20} color="var(--accent)" />
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--accent)' }}>
                      Din konto er beskyttet
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                    Tofaktorautentisering er aktivert. Sist innlogget: I dag kl 08:45
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    border: `1px solid ${'var(--border-default)'}`,
                    backgroundColor: 'transparent',
                    cursor: 'pointer'
                  }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                      Endre passord
                    </span>
                    <ChevronRight size={18} color={'var(--text-tertiary)'} />
                  </button>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    border: `1px solid ${'var(--border-default)'}`,
                    backgroundColor: 'transparent',
                    cursor: 'pointer'
                  }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                      Administrer tofaktorautentisering
                    </span>
                    <ChevronRight size={18} color={'var(--text-tertiary)'} />
                  </button>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    border: `1px solid ${'var(--border-default)'}`,
                    backgroundColor: 'transparent',
                    cursor: 'pointer'
                  }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                      Last ned mine data
                    </span>
                    <ChevronRight size={18} color={'var(--text-tertiary)'} />
                  </button>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    cursor: 'pointer'
                  }}>
                    <span style={{ fontSize: '14px', color: 'var(--error)' }}>
                      Slett konto
                    </span>
                    <ChevronRight size={18} color="var(--error)" />
                  </button>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div style={{
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: `1px solid ${'var(--border-default)'}`,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              {saveSuccess && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#16a34a',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  <Check size={16} />
                  Lagret!
                </div>
              )}
              <button
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  opacity: isSaving ? 0.7 : 1
                }}
              >
                <Save size={16} />
                {isSaving ? 'Lagrer...' : 'Lagre endringer'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachSettings;
