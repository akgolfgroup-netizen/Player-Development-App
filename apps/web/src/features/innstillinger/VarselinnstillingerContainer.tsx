import React, { useState } from 'react';
import {
  Bell, Mail, Smartphone, MessageSquare, Calendar,
  Trophy, Target, Save, Info, Clock
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { settingsAPI } from '../../services/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Switch,
  Label,
  Button,
  Separator,
} from '../../components/shadcn';
import { useToast } from '../../components/shadcn/use-toast';
import { cn } from 'lib/utils';

// ============================================================================
// TYPES
// ============================================================================

interface NotificationSettings {
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  categories: {
    training: {
      enabled: boolean;
      reminders: boolean;
      coachFeedback: boolean;
      planUpdates: boolean;
    };
    tournaments: {
      enabled: boolean;
      registrationDeadlines: boolean;
      results: boolean;
      rankings: boolean;
    };
    goals: {
      enabled: boolean;
      achievements: boolean;
      milestones: boolean;
      weeklyProgress: boolean;
    };
    messages: {
      enabled: boolean;
      fromCoach: boolean;
      fromAdmin: boolean;
    };
    system: {
      enabled: boolean;
      maintenance: boolean;
      newFeatures: boolean;
    };
  };
  timing: {
    quietHoursEnabled: boolean;
    quietStart: string;
    quietEnd: string;
    dailySummary: boolean;
    dailySummaryTime: string;
  };
}

// ============================================================================
// MOCK DATA
// ============================================================================

const NOTIFICATION_SETTINGS: NotificationSettings = {
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
// SETTING ROW COMPONENT
// ============================================================================

interface SettingRowProps {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  id: string;
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon: Icon,
  label,
  description,
  enabled,
  onChange,
  disabled,
  id,
}) => (
  <div
    className={cn(
      "flex items-center justify-between py-3",
      disabled && "opacity-50"
    )}
  >
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="w-8 h-8 rounded-lg bg-tier-navy/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-tier-navy" />
        </div>
      )}
      <div className="space-y-0.5">
        <Label
          htmlFor={id}
          className="text-sm font-medium text-text-primary cursor-pointer"
        >
          {label}
        </Label>
        {description && (
          <p className="text-xs text-text-secondary">{description}</p>
        )}
      </div>
    </div>
    <Switch
      id={id}
      checked={enabled && !disabled}
      onCheckedChange={disabled ? undefined : onChange}
      disabled={disabled}
    />
  </div>
);

// ============================================================================
// SECTION COMPONENT
// ============================================================================

interface SectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  enabled?: boolean;
  onToggle?: (value: boolean) => void;
  id: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  icon: Icon,
  children,
  enabled = true,
  onToggle,
  id,
}) => (
  <Card className="mb-4">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-tier-navy/15 flex items-center justify-center">
            <Icon className="w-5 h-5 text-tier-navy" />
          </div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </div>
        {onToggle && (
          <Switch
            id={id}
            checked={enabled}
            onCheckedChange={onToggle}
          />
        )}
      </div>
    </CardHeader>
    <CardContent className={cn("pt-0", !enabled && "opacity-50")}>
      <div className="divide-y divide-border-subtle">
        {children}
      </div>
    </CardContent>
  </Card>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const VarselinnstillingerContainer: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>(NOTIFICATION_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const updateChannel = (channel: keyof NotificationSettings['channels'], value: boolean) => {
    setSettings({
      ...settings,
      channels: { ...settings.channels, [channel]: value },
    });
    setHasChanges(true);
  };

  const updateCategory = (
    category: keyof NotificationSettings['categories'],
    field: string,
    value: boolean
  ) => {
    setSettings({
      ...settings,
      categories: {
        ...settings.categories,
        [category]: { ...settings.categories[category], [field]: value },
      },
    });
    setHasChanges(true);
  };

  const updateTiming = (field: keyof NotificationSettings['timing'], value: boolean) => {
    setSettings({
      ...settings,
      timing: { ...settings.timing, [field]: value },
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      await settingsAPI.saveNotifications({
        channels: settings.channels,
        categories: settings.categories,
        timing: settings.timing,
      });

      toast({
        title: "Innstillinger lagret",
        description: "Varselinnstillingene dine er oppdatert.",
      });
      setHasChanges(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Kunne ikke lagre innstillinger.";
      toast({
        title: "Feil ved lagring",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-default">
      <PageHeader
        title="Varselinnstillinger"
        subtitle="Tilpass hvordan du mottar varsler"
        helpText="Administrer hvilke varsler du vil motta via e-post, push-notifikasjoner eller i appen. Velg varslingskanaler for ulike hendelser og oppdateringer."
      />

      <div className="px-6 pb-6 max-w-2xl mx-auto space-y-4">
        {/* Notification Channels */}
        <Section title="Varslingskanaler" icon={Bell} id="channels">
          <SettingRow
            id="push"
            icon={Smartphone}
            label="Push-varsler"
            description="Varsler på mobilen"
            enabled={settings.channels.push}
            onChange={(val) => updateChannel('push', val)}
          />
          <SettingRow
            id="email"
            icon={Mail}
            label="E-post"
            description="Varsler på e-post"
            enabled={settings.channels.email}
            onChange={(val) => updateChannel('email', val)}
          />
          <SettingRow
            id="sms"
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
          id="training"
        >
          <SettingRow
            id="training-reminders"
            label="Treningspåminnelser"
            description="Påminnelse før kommende økter"
            enabled={settings.categories.training.reminders}
            onChange={(val) => updateCategory('training', 'reminders', val)}
            disabled={!settings.categories.training.enabled}
          />
          <SettingRow
            id="training-feedback"
            label="Trener-feedback"
            description="Når treneren gir tilbakemelding"
            enabled={settings.categories.training.coachFeedback}
            onChange={(val) => updateCategory('training', 'coachFeedback', val)}
            disabled={!settings.categories.training.enabled}
          />
          <SettingRow
            id="training-plans"
            label="Planoppdateringer"
            description="Når treningsplanen endres"
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
          id="tournaments"
        >
          <SettingRow
            id="tournament-deadlines"
            label="Påmeldingsfrister"
            description="Påminnelse før turneringspåmelding"
            enabled={settings.categories.tournaments.registrationDeadlines}
            onChange={(val) => updateCategory('tournaments', 'registrationDeadlines', val)}
            disabled={!settings.categories.tournaments.enabled}
          />
          <SettingRow
            id="tournament-results"
            label="Resultater"
            description="Når resultater publiseres"
            enabled={settings.categories.tournaments.results}
            onChange={(val) => updateCategory('tournaments', 'results', val)}
            disabled={!settings.categories.tournaments.enabled}
          />
          <SettingRow
            id="tournament-rankings"
            label="Rangeringer"
            description="Oppdateringer i rangeringslister"
            enabled={settings.categories.tournaments.rankings}
            onChange={(val) => updateCategory('tournaments', 'rankings', val)}
            disabled={!settings.categories.tournaments.enabled}
          />
        </Section>

        {/* Goal Notifications */}
        <Section
          title="Mål og prestasjoner"
          icon={Target}
          enabled={settings.categories.goals.enabled}
          onToggle={(val) => updateCategory('goals', 'enabled', val)}
          id="goals"
        >
          <SettingRow
            id="goals-achievements"
            label="Nye prestasjoner"
            description="Når du oppnår en prestasjon"
            enabled={settings.categories.goals.achievements}
            onChange={(val) => updateCategory('goals', 'achievements', val)}
            disabled={!settings.categories.goals.enabled}
          />
          <SettingRow
            id="goals-milestones"
            label="Milepæler"
            description="Når du når en milepæl"
            enabled={settings.categories.goals.milestones}
            onChange={(val) => updateCategory('goals', 'milestones', val)}
            disabled={!settings.categories.goals.enabled}
          />
          <SettingRow
            id="goals-weekly"
            label="Ukentlig oppsummering"
            description="Ukentlig fremgangsrapport"
            enabled={settings.categories.goals.weeklyProgress}
            onChange={(val) => updateCategory('goals', 'weeklyProgress', val)}
            disabled={!settings.categories.goals.enabled}
          />
        </Section>

        {/* Timing Settings */}
        <Section title="Timing" icon={Clock} id="timing">
          <SettingRow
            id="timing-quiet"
            label="Stille timer"
            description="Ingen varsler mellom kl. 22:00 og 07:00"
            enabled={settings.timing.quietHoursEnabled}
            onChange={(val) => updateTiming('quietHoursEnabled', val)}
          />
          <SettingRow
            id="timing-summary"
            label="Daglig oppsummering"
            description="Motta en daglig oppsummering kl. 18:00"
            enabled={settings.timing.dailySummary}
            onChange={(val) => updateTiming('dailySummary', val)}
          />
        </Section>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="w-full"
          size="lg"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Lagrer...' : 'Lagre endringer'}
        </Button>
      </div>
    </div>
  );
};

export default VarselinnstillingerContainer;
