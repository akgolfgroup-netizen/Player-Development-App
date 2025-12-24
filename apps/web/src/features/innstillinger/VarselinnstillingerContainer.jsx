import React, { useState } from 'react';
import {
  Bell, Mail, Smartphone, MessageSquare, Calendar,
  Trophy, Target, Save, Info
} from 'lucide-react';
import { tokens } from '../../design-tokens';
import { PageHeader } from '../../components/layout/PageHeader';
import { settingsAPI } from '../../services/api';

// ============================================================================
// MOCK DATA
// ============================================================================

const NOTIFICATION_SETTINGS = {
  channels: {
    push: true,
    email: true,
    sms: false,
  },
  categories: {
    training: {
      enabled: true,
      reminders: true,
      coachFeedback: true,
      planUpdates: true,
    },
    tournaments: {
      enabled: true,
      registrationDeadlines: true,
      results: true,
      rankings: true,
    },
    goals: {
      enabled: true,
      achievements: true,
      milestones: true,
      weeklyProgress: true,
    },
    messages: {
      enabled: true,
      fromCoach: true,
      fromAdmin: true,
    },
    system: {
      enabled: true,
      maintenance: true,
      newFeatures: false,
    },
  },
  timing: {
    quietHoursEnabled: false,
    quietStart: '22:00',
    quietEnd: '07:00',
    dailySummary: true,
    dailySummaryTime: '18:00',
  },
};

// ============================================================================
// TOGGLE SWITCH
// ============================================================================

const ToggleSwitch = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    style={{
      width: '48px',
      height: '26px',
      borderRadius: '13px',
      backgroundColor: enabled ? tokens.colors.primary : tokens.colors.mist,
      border: 'none',
      padding: '2px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'relative',
    }}
  >
    <div style={{
      width: '22px',
      height: '22px',
      borderRadius: '50%',
      backgroundColor: tokens.colors.white,
      transition: 'transform 0.2s',
      transform: enabled ? 'translateX(22px)' : 'translateX(0)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    }} />
  </button>
);

// ============================================================================
// SETTING ROW
// ============================================================================

const SettingRow = ({ icon: Icon, label, description, enabled, onChange, disabled }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: `1px solid ${tokens.colors.mist}`,
    opacity: disabled ? 0.5 : 1,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {Icon && (
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          backgroundColor: `${tokens.colors.primary}10`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon size={16} color={tokens.colors.primary} />
        </div>
      )}
      <div>
        <div style={{
          fontSize: '14px',
          fontWeight: 500,
          color: tokens.colors.charcoal,
        }}>
          {label}
        </div>
        {description && (
          <div style={{
            fontSize: '12px',
            color: tokens.colors.steel,
            marginTop: '2px',
          }}>
            {description}
          </div>
        )}
      </div>
    </div>
    <ToggleSwitch
      enabled={enabled && !disabled}
      onChange={disabled ? () => {} : onChange}
    />
  </div>
);

// ============================================================================
// SECTION
// ============================================================================

const Section = ({ title, icon: Icon, children, enabled, onToggle }) => (
  <div style={{
    backgroundColor: tokens.colors.white,
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '20px',
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          backgroundColor: `${tokens.colors.primary}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon size={18} color={tokens.colors.primary} />
        </div>
        <h3 style={{
          fontSize: '15px',
          fontWeight: 600,
          color: tokens.colors.charcoal,
          margin: 0,
        }}>
          {title}
        </h3>
      </div>
      {onToggle && (
        <ToggleSwitch enabled={enabled} onChange={onToggle} />
      )}
    </div>
    <div style={{ opacity: enabled === false ? 0.5 : 1 }}>
      {children}
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const VarselinnstillingerContainer = () => {
  const [settings, setSettings] = useState(NOTIFICATION_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateChannel = (channel, value) => {
    setSettings({
      ...settings,
      channels: { ...settings.channels, [channel]: value },
    });
    setHasChanges(true);
  };

  const updateCategory = (category, field, value) => {
    setSettings({
      ...settings,
      categories: {
        ...settings.categories,
        [category]: { ...settings.categories[category], [field]: value },
      },
    });
    setHasChanges(true);
  };

  const updateTiming = (field, value) => {
    setSettings({
      ...settings,
      timing: { ...settings.timing, [field]: value },
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      await settingsAPI.saveNotifications({
        channels: settings.channels,
        categories: settings.categories,
        timing: settings.timing,
      });

      setSuccess(true);
      setHasChanges(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Kunne ikke lagre innstillinger.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.snow }}>
      <PageHeader
        title="Varselinnstillinger"
        subtitle="Tilpass hvordan du mottar varsler"
      />

      <div style={{ padding: '16px 24px 24px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Notification Channels */}
        <Section title="Varslingskanaler" icon={Bell}>
          <SettingRow
            icon={Smartphone}
            label="Push-varsler"
            description="Varsler pa mobilen"
            enabled={settings.channels.push}
            onChange={(val) => updateChannel('push', val)}
          />
          <SettingRow
            icon={Mail}
            label="E-post"
            description="Varsler pa e-post"
            enabled={settings.channels.email}
            onChange={(val) => updateChannel('email', val)}
          />
          <SettingRow
            icon={MessageSquare}
            label="SMS"
            description="Tekstmeldinger for viktige varsler"
            enabled={settings.channels.sms}
            onChange={(val) => updateChannel('sms', val)}
          />
        </Section>

        {/* Training Notifications */}
        <Section
          title="Trening"
          icon={Calendar}
          enabled={settings.categories.training.enabled}
          onToggle={(val) => updateCategory('training', 'enabled', val)}
        >
          <SettingRow
            label="Treningspaminnelser"
            description="Paminning for om kommende okter"
            enabled={settings.categories.training.reminders}
            onChange={(val) => updateCategory('training', 'reminders', val)}
            disabled={!settings.categories.training.enabled}
          />
          <SettingRow
            label="Trener-feedback"
            description="Nar treneren gir tilbakemelding"
            enabled={settings.categories.training.coachFeedback}
            onChange={(val) => updateCategory('training', 'coachFeedback', val)}
            disabled={!settings.categories.training.enabled}
          />
          <SettingRow
            label="Planoppdateringer"
            description="Nar treningsplanen endres"
            enabled={settings.categories.training.planUpdates}
            onChange={(val) => updateCategory('training', 'planUpdates', val)}
            disabled={!settings.categories.training.enabled}
          />
        </Section>

        {/* Tournament Notifications */}
        <Section
          title="Turneringer"
          icon={Trophy}
          enabled={settings.categories.tournaments.enabled}
          onToggle={(val) => updateCategory('tournaments', 'enabled', val)}
        >
          <SettingRow
            label="Pameldingsfrister"
            description="Paminning for turneringspamelding"
            enabled={settings.categories.tournaments.registrationDeadlines}
            onChange={(val) => updateCategory('tournaments', 'registrationDeadlines', val)}
            disabled={!settings.categories.tournaments.enabled}
          />
          <SettingRow
            label="Resultater"
            description="Nar resultater publiseres"
            enabled={settings.categories.tournaments.results}
            onChange={(val) => updateCategory('tournaments', 'results', val)}
            disabled={!settings.categories.tournaments.enabled}
          />
          <SettingRow
            label="Rangeringer"
            description="Oppdateringer i rangeringslister"
            enabled={settings.categories.tournaments.rankings}
            onChange={(val) => updateCategory('tournaments', 'rankings', val)}
            disabled={!settings.categories.tournaments.enabled}
          />
        </Section>

        {/* Goal Notifications */}
        <Section
          title="Mal og prestasjoner"
          icon={Target}
          enabled={settings.categories.goals.enabled}
          onToggle={(val) => updateCategory('goals', 'enabled', val)}
        >
          <SettingRow
            label="Nye prestasjoner"
            description="Nar du oppnar en prestasjon"
            enabled={settings.categories.goals.achievements}
            onChange={(val) => updateCategory('goals', 'achievements', val)}
            disabled={!settings.categories.goals.enabled}
          />
          <SettingRow
            label="Milepeler"
            description="Nar du nar en milepel"
            enabled={settings.categories.goals.milestones}
            onChange={(val) => updateCategory('goals', 'milestones', val)}
            disabled={!settings.categories.goals.enabled}
          />
          <SettingRow
            label="Ukentlig oppsummering"
            description="Ukentlig fremgangsrapport"
            enabled={settings.categories.goals.weeklyProgress}
            onChange={(val) => updateCategory('goals', 'weeklyProgress', val)}
            disabled={!settings.categories.goals.enabled}
          />
        </Section>

        {/* Timing Settings */}
        <Section title="Timing" icon={Info}>
          <SettingRow
            label="Stille timer"
            description="Ingen varsler mellom kl. 22:00 og 07:00"
            enabled={settings.timing.quietHoursEnabled}
            onChange={(val) => updateTiming('quietHoursEnabled', val)}
          />
          <SettingRow
            label="Daglig oppsummering"
            description="Motta en daglig oppsummering kl. 18:00"
            enabled={settings.timing.dailySummary}
            onChange={(val) => updateTiming('dailySummary', val)}
          />
        </Section>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: hasChanges ? tokens.colors.primary : tokens.colors.mist,
            color: hasChanges ? tokens.colors.white : tokens.colors.steel,
            fontSize: '15px',
            fontWeight: 600,
            cursor: hasChanges ? 'pointer' : 'not-allowed',
          }}
        >
          <Save size={18} />
          Lagre endringer
        </button>
      </div>
    </div>
  );
};

export default VarselinnstillingerContainer;
