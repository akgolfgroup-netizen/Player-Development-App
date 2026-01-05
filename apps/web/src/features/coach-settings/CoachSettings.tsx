/**
 * CoachSettings.tsx
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import {
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
  Check,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { coachesAPI, settingsAPI } from '../../services/api';
import Button from '../../ui/primitives/Button';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';
import StateCard from '../../ui/composites/StateCard';
import { SectionTitle, SubSectionTitle } from '../../components/typography';

// ============================================================================
// COMPONENTS
// ============================================================================

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onToggle }) => (
  <button
    onClick={onToggle}
    className={`w-12 h-[26px] rounded-[13px] border-none relative cursor-pointer transition-colors ${
      enabled ? 'bg-ak-primary' : 'bg-ak-border-default'
    }`}
  >
    <div
      className={`w-[22px] h-[22px] rounded-full bg-white absolute top-0.5 shadow transition-all ${
        enabled ? 'left-6' : 'left-0.5'
      }`}
    />
  </button>
);

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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'display' | 'privacy'>('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<CoachProfile>({
    name: '',
    email: '',
    phone: '',
    title: '',
    bio: '',
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

  // Fetch coach profile on mount
  const fetchProfile = useCallback(async () => {
    if (!user?.coachId && !user?.id) return;

    setIsLoading(true);
    setError(null);
    try {
      const coachId = user.coachId || user.id;
      const response = await coachesAPI.getById(coachId);
      const data = response.data?.data || response.data;

      if (data) {
        setProfile({
          name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.name || '',
          email: data.email || data.user?.email || '',
          phone: data.phone || data.user?.phone || '',
          title: data.specialization || data.title || 'Trener',
          bio: data.bio || data.description || '',
          avatar: data.avatar || data.profileImage,
        });

        // Load notification settings if available
        if (data.notificationSettings) {
          setNotifications({
            ...notifications,
            ...data.notificationSettings,
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Kunne ikke laste profil');
    } finally {
      setIsLoading(false);
    }
  }, [user?.coachId, user?.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async () => {
    if (!user?.coachId && !user?.id) return;

    setIsSaving(true);
    setError(null);
    try {
      const coachId = user.coachId || user.id;

      // Split name into first and last
      const nameParts = profile.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Save profile
      await coachesAPI.update(coachId, {
        firstName,
        lastName,
        phone: profile.phone,
        specialization: profile.title,
        bio: profile.bio,
      });

      // Save notification settings
      await settingsAPI.saveNotifications(notifications);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setError('Kunne ikke lagre endringer');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-ak-surface-subtle min-h-screen flex items-center justify-center">
        <StateCard variant="loading" title="Laster innstillinger..." />
      </div>
    );
  }

  const tabs = [
    { key: 'profile', label: 'Profil', icon: User },
    { key: 'notifications', label: 'Varsler', icon: Bell },
    { key: 'display', label: 'Visning', icon: Sun },
    { key: 'privacy', label: 'Personvern', icon: Shield }
  ];

  return (
    <div className="bg-ak-surface-subtle min-h-screen">
      {/* Header - using PageHeader from design system */}
      <PageHeader
        title="Innstillinger"
        subtitle="Administrer din profil og preferanser"
      />

      <div className="px-6 pb-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-60 flex-shrink-0">
            <div className="bg-ak-surface-base rounded-2xl border border-ak-border-default overflow-hidden">
              {tabs.map(tab => {
                const isActive = activeTab === tab.key;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className={`w-full py-3.5 px-4 border-none flex items-center gap-3 cursor-pointer transition-all ${
                      isActive
                        ? 'bg-ak-primary/10 border-l-[3px] border-l-ak-primary'
                        : 'bg-transparent border-l-[3px] border-l-transparent'
                    }`}
                  >
                    <Icon
                      size={18}
                      className={isActive ? 'text-ak-primary' : 'text-ak-text-secondary'}
                    />
                    <span className={`text-sm ${isActive ? 'font-semibold text-ak-primary' : 'font-medium text-ak-text-secondary'}`}>
                      {tab.label}
                    </span>
                    <ChevronRight
                      size={16}
                      className={`text-ak-text-secondary ml-auto ${isActive ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-ak-surface-base rounded-2xl border border-ak-border-default p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <SectionTitle className="text-lg font-semibold text-ak-text-primary m-0 mb-5">
                  Profilinformasjon
                </SectionTitle>

                {/* Avatar */}
                <div className="mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-ak-primary/15 flex items-center justify-center text-[28px] font-semibold text-ak-primary">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <Button variant="secondary" className="mb-1.5" leftIcon={<Camera size={14} />}>
                        Last opp bilde
                      </Button>
                      <p className="text-xs text-ak-text-secondary m-0">
                        JPG, PNG maks 2MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[13px] font-medium text-ak-text-secondary mb-1.5">
                      Fullt navn
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full py-2.5 px-3.5 rounded-lg border border-ak-border-default text-sm text-ak-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-ak-text-secondary mb-1.5">
                      Tittel
                    </label>
                    <input
                      type="text"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      className="w-full py-2.5 px-3.5 rounded-lg border border-ak-border-default text-sm text-ak-text-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[13px] font-medium text-ak-text-secondary mb-1.5">
                      <Mail size={12} className="mr-1.5 inline" />
                      E-post
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full py-2.5 px-3.5 rounded-lg border border-ak-border-default text-sm text-ak-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-ak-text-secondary mb-1.5">
                      <Phone size={12} className="mr-1.5 inline" />
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full py-2.5 px-3.5 rounded-lg border border-ak-border-default text-sm text-ak-text-primary"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-[13px] font-medium text-ak-text-secondary mb-1.5">
                    Bio / Beskrivelse
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                    className="w-full py-2.5 px-3.5 rounded-lg border border-ak-border-default text-sm text-ak-text-primary resize-y font-inherit"
                  />
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <SectionTitle className="text-lg font-semibold text-ak-text-primary m-0 mb-5">
                  Varslingsinnstillinger
                </SectionTitle>

                <div className="mb-6">
                  <SubSectionTitle className="text-sm font-semibold text-ak-text-secondary m-0 mb-3 uppercase tracking-wide">
                    Aktivitetsvarsler
                  </SubSectionTitle>
                  {[
                    { key: 'newBooking', label: 'Nye bookingforespørsler', desc: 'Når en spiller ber om en økt' },
                    { key: 'bookingReminder', label: 'Bookingpåminnelser', desc: '24 timer før planlagte økter' },
                    { key: 'playerUpdate', label: 'Spilleroppdateringer', desc: 'Når spillere logger trening eller tester' },
                    { key: 'tournamentResults', label: 'Turneringsresultater', desc: 'Når spillere registrerer resultater' },
                    { key: 'systemUpdates', label: 'Systemoppdateringer', desc: 'Nyheter og oppdateringer fra plattformen' }
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-ak-border-default">
                      <div>
                        <p className="text-sm font-medium text-ak-text-primary m-0">
                          {item.label}
                        </p>
                        <p className="text-xs text-ak-text-secondary mt-0.5 m-0">
                          {item.desc}
                        </p>
                      </div>
                      <ToggleSwitch
                        enabled={!!notifications[item.key as keyof NotificationSettings]}
                        onToggle={() => setNotifications({
                          ...notifications,
                          [item.key]: !notifications[item.key as keyof NotificationSettings]
                        })}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <SubSectionTitle className="text-sm font-semibold text-ak-text-secondary m-0 mb-3 uppercase tracking-wide">
                    Leveringsmetode
                  </SubSectionTitle>
                  {[
                    { key: 'emailNotifications', label: 'E-postvarsler', icon: Mail },
                    { key: 'pushNotifications', label: 'Push-varsler', icon: Bell }
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-ak-border-default">
                      <div className="flex items-center gap-2.5">
                        <item.icon size={18} className="text-ak-text-secondary" />
                        <span className="text-sm font-medium text-ak-text-primary">
                          {item.label}
                        </span>
                      </div>
                      <ToggleSwitch
                        enabled={!!notifications[item.key as keyof NotificationSettings]}
                        onToggle={() => setNotifications({
                          ...notifications,
                          [item.key]: !notifications[item.key as keyof NotificationSettings]
                        })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Display Tab */}
            {activeTab === 'display' && (
              <div>
                <SectionTitle className="text-lg font-semibold text-ak-text-primary m-0 mb-5">
                  Visningsinnstillinger
                </SectionTitle>

                <div className="mb-6">
                  <label className="block text-[13px] font-medium text-ak-text-secondary mb-2.5">
                    Tema
                  </label>
                  <div className="flex gap-3">
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
                          className={`flex-1 p-4 rounded-xl flex flex-col items-center gap-2 cursor-pointer ${
                            isSelected
                              ? 'border-2 border-ak-primary bg-ak-primary/10'
                              : 'border border-ak-border-default bg-transparent'
                          }`}
                        >
                          <option.icon
                            size={24}
                            className={isSelected ? 'text-ak-primary' : 'text-ak-text-secondary'}
                          />
                          <span className={`text-sm ${isSelected ? 'font-semibold text-ak-primary' : 'font-medium text-ak-text-secondary'}`}>
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-[13px] font-medium text-ak-text-secondary mb-2.5">
                    <Globe size={14} className="mr-1.5 inline" />
                    Språk
                  </label>
                  <select
                    value={display.language}
                    onChange={(e) => setDisplay({ ...display, language: e.target.value as DisplaySettings['language'] })}
                    className="w-52 py-2.5 px-3.5 rounded-lg border border-ak-border-default text-sm text-ak-text-primary cursor-pointer"
                  >
                    <option value="no">Norsk</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <SubSectionTitle className="text-sm font-semibold text-ak-text-secondary m-0 mb-3 uppercase tracking-wide">
                    Visningsalternativer
                  </SubSectionTitle>
                  {[
                    { key: 'compactView', label: 'Kompakt visning', desc: 'Vis mer innhold med mindre mellomrom' },
                    { key: 'showPlayerPhotos', label: 'Vis spillerbilder', desc: 'Vis profilbilder i lister' }
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-ak-border-default">
                      <div>
                        <p className="text-sm font-medium text-ak-text-primary m-0">
                          {item.label}
                        </p>
                        <p className="text-xs text-ak-text-secondary mt-0.5 m-0">
                          {item.desc}
                        </p>
                      </div>
                      <ToggleSwitch
                        enabled={!!display[item.key as keyof DisplaySettings]}
                        onToggle={() => setDisplay({
                          ...display,
                          [item.key]: !display[item.key as keyof DisplaySettings]
                        })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div>
                <SectionTitle className="text-lg font-semibold text-ak-text-primary m-0 mb-5">
                  Personvern og sikkerhet
                </SectionTitle>

                <div className="p-4 bg-ak-primary/10 rounded-xl mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield size={20} className="text-ak-primary" />
                    <span className="text-sm font-semibold text-ak-primary">
                      Din konto er beskyttet
                    </span>
                  </div>
                  <p className="text-[13px] text-ak-text-secondary m-0">
                    Tofaktorautentisering er aktivert. Sist innlogget: I dag kl 08:45
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button className="flex items-center justify-between py-3.5 px-4 rounded-[10px] border border-ak-border-default bg-transparent cursor-pointer">
                    <span className="text-sm text-ak-text-primary">
                      Endre passord
                    </span>
                    <ChevronRight size={18} className="text-ak-text-secondary" />
                  </button>
                  <button className="flex items-center justify-between py-3.5 px-4 rounded-[10px] border border-ak-border-default bg-transparent cursor-pointer">
                    <span className="text-sm text-ak-text-primary">
                      Administrer tofaktorautentisering
                    </span>
                    <ChevronRight size={18} className="text-ak-text-secondary" />
                  </button>
                  <button className="flex items-center justify-between py-3.5 px-4 rounded-[10px] border border-ak-border-default bg-transparent cursor-pointer">
                    <span className="text-sm text-ak-text-primary">
                      Last ned mine data
                    </span>
                    <ChevronRight size={18} className="text-ak-text-secondary" />
                  </button>
                  <button className="flex items-center justify-between py-3.5 px-4 rounded-[10px] border border-ak-status-error/30 bg-ak-status-error/5 cursor-pointer">
                    <span className="text-sm text-ak-status-error">
                      Slett konto
                    </span>
                    <ChevronRight size={18} className="text-ak-status-error" />
                  </button>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-6 pt-5 border-t border-ak-border-default flex justify-end gap-3">
              {saveSuccess && (
                <div className="flex items-center gap-1.5 text-ak-status-success text-sm font-medium">
                  <Check size={16} />
                  Lagret!
                </div>
              )}
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isSaving}
                leftIcon={<Save size={16} />}
              >
                {isSaving ? 'Lagrer...' : 'Lagre endringer'}
              </Button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachSettings;
