/**
 * SharingPermissions - Data sharing settings
 *
 * Allows users to control what data they share with coaches and team members
 */

import React, { useState } from 'react';
import { Share2, Users, UserCheck, Save } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { SectionTitle, SubSectionTitle } from '../../components/typography/Headings';
import {
  Card,
  CardContent,
  Button,
  Checkbox,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/shadcn';

// Data types that can be shared
const DATA_TYPES = [
  { id: 'sessions', label: 'Treningsøkter', description: 'Planlagte og fullførte økter' },
  { id: 'tests', label: 'Tester', description: 'Testresultater og historikk' },
  { id: 'goals', label: 'Målsettinger', description: 'Personlige mål og fremgang' },
  { id: 'tournaments', label: 'Turneringer', description: 'Turnerings-deltakelse og resultater' },
  { id: 'videos', label: 'Video', description: 'Treningsvideoer og analyser' },
];

// Who can access shared data
type ShareTarget = 'coach' | 'members' | 'none';

const SHARE_TARGETS = [
  { value: 'none', label: 'Ingen', icon: Users },
  { value: 'coach', label: 'Kun trener', icon: UserCheck },
  { value: 'members', label: 'Trener og medlemmer', icon: Share2 },
];

export default function SharingPermissions() {
  // Track which data types are enabled for sharing
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    sessions: false,
    tests: false,
    goals: false,
    tournaments: false,
    videos: false,
  });

  // Track who can see the shared data
  const [shareTarget, setShareTarget] = useState<ShareTarget>('coach');

  const handleToggle = (dataType: string) => {
    setPermissions((prev) => ({
      ...prev,
      [dataType]: !prev[dataType],
    }));
  };

  const handleSave = () => {
    // TODO: Save to API
    alert('Delingsinnstillinger lagret!');
  };

  const anyEnabled = Object.values(permissions).some((enabled) => enabled);

  return (
    <div className="min-h-screen bg-background-default">
      <PageHeader
        title="Deling"
        subtitle="Kontroller hvilke data du deler med trener og medlemmer"
        helpText="Administrer hvilke data og aktiviteter som er synlige for trener, treningspartnere og andre medlemmer. Bestem selv hva du ønsker å dele."
        actions={null}
      />

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-tier-navy/10 flex items-center justify-center flex-shrink-0">
                <Share2 className="w-6 h-6 text-tier-navy" />
              </div>
              <div className="flex-1">
                <SubSectionTitle className="mb-2">Om datadeling</SubSectionTitle>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Velg hvilke data du ønsker å dele med din trener og andre medlemmer.
                  Du har full kontroll og kan endre innstillingene når som helst.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Share Target Selection */}
        <Card>
          <CardContent className="p-6">
            <SubSectionTitle className="mb-4">Hvem skal ha tilgang?</SubSectionTitle>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-text-primary">Delingstype</Label>
              <Select value={shareTarget} onValueChange={(v) => setShareTarget(v as ShareTarget)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SHARE_TARGETS.map((target) => {
                    const Icon = target.icon;
                    return (
                      <SelectItem key={target.value} value={target.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {target.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {shareTarget === 'none' && (
                <p className="text-xs text-text-tertiary mt-2">
                  Ingen har tilgang til dine data
                </p>
              )}
              {shareTarget === 'coach' && (
                <p className="text-xs text-text-tertiary mt-2">
                  Kun din trener kan se de data du velger å dele
                </p>
              )}
              {shareTarget === 'members' && (
                <p className="text-xs text-text-tertiary mt-2">
                  Din trener og andre medlemmer kan se de data du velger å dele
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Data Types Selection */}
        <Card>
          <CardContent className="p-6">
            <SubSectionTitle className="mb-4">Velg hva du vil dele</SubSectionTitle>
            <div className="space-y-4">
              {DATA_TYPES.map((dataType) => (
                <div
                  key={dataType.id}
                  className="flex items-start gap-3 p-4 rounded-lg border border-border-subtle hover:bg-background-default transition-colors"
                >
                  <Checkbox
                    id={dataType.id}
                    checked={permissions[dataType.id] || false}
                    onCheckedChange={() => handleToggle(dataType.id)}
                    disabled={shareTarget === 'none'}
                  />
                  <div className="flex-1 min-w-0">
                    <Label
                      htmlFor={dataType.id}
                      className={`text-sm font-medium cursor-pointer ${
                        shareTarget === 'none' ? 'text-text-tertiary' : 'text-text-primary'
                      }`}
                    >
                      {dataType.label}
                    </Label>
                    <p className="text-xs text-text-secondary mt-1">{dataType.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {shareTarget === 'none' && (
              <div className="mt-4 p-3 bg-tier-surface-subtle rounded-lg">
                <p className="text-sm text-text-secondary">
                  Velg en delingstype over for å aktivere datadelingsvalg
                </p>
              </div>
            )}

            {!anyEnabled && shareTarget !== 'none' && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-900">
                  Du har ikke valgt noen data å dele. Velg minst én kategori.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setPermissions({
                sessions: false,
                tests: false,
                goals: false,
                tournaments: false,
                videos: false,
              });
              setShareTarget('coach');
            }}
          >
            Tilbakestill
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            Lagre innstillinger
          </Button>
        </div>
      </div>
    </div>
  );
}
