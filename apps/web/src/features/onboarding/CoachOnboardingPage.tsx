/**
 * CoachOnboardingPage
 *
 * Single-page onboarding flow for new coaches
 * All steps collected on one page with sections
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Textarea, Badge } from '../../components/shadcn';
import { PageTitle } from '../../ui/components/typography';
import { User, Award, Building, Users, CheckCircle, X, Plus, Mail } from 'lucide-react';
import { TIERGolfFullLogo } from '../../components/branding/TIERGolfFullLogo';

interface CoachOnboardingData {
  // Personal information
  firstName: string;
  lastName: string;
  phone: string;

  // Coach profile
  specializations: string[];
  experienceYears: string;
  certifications: string[];
  newCertification: string;
  bio: string;

  // Organization
  organizationType: 'club' | 'independent' | 'federation' | '';
  clubName: string;

  // Invite players
  playerEmails: string[];
  newPlayerEmail: string;
}

const SPECIALIZATIONS = [
  'Teknikk',
  'Mental trening',
  'Fysisk trening',
  'Juniorutvikling',
  'Elitecoaching',
  'Putting',
  'Kort spill',
  'Langt spill',
  'Kursplanlegging',
  'Banemanagement',
];

const EXPERIENCE_OPTIONS = [
  { value: '0-2', label: '0-2 ar' },
  { value: '3-5', label: '3-5 ar' },
  { value: '6-10', label: '6-10 ar' },
  { value: '10+', label: 'Over 10 ar' },
];

export default function CoachOnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<CoachOnboardingData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: '',
    specializations: [],
    experienceYears: '',
    certifications: [],
    newCertification: '',
    bio: '',
    organizationType: '',
    clubName: '',
    playerEmails: [],
    newPlayerEmail: '',
  });

  const handleInputChange = (field: keyof CoachOnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecializationToggle = (specialization: string) => {
    setData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...prev.specializations, specialization]
    }));
  };

  const handleAddCertification = () => {
    if (data.newCertification.trim()) {
      setData(prev => ({
        ...prev,
        certifications: [...prev.certifications, prev.newCertification.trim()],
        newCertification: '',
      }));
    }
  };

  const handleRemoveCertification = (cert: string) => {
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== cert),
    }));
  };

  const handleAddPlayerEmail = () => {
    const email = data.newPlayerEmail.trim().toLowerCase();
    if (email && email.includes('@') && !data.playerEmails.includes(email)) {
      setData(prev => ({
        ...prev,
        playerEmails: [...prev.playerEmails, email],
        newPlayerEmail: '',
      }));
    }
  };

  const handleRemovePlayerEmail = (email: string) => {
    setData(prev => ({
      ...prev,
      playerEmails: prev.playerEmails.filter(e => e !== email),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const coachData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        specializations: data.specializations,
        experienceYears: data.experienceYears,
        certifications: data.certifications,
        bio: data.bio,
        organizationType: data.organizationType,
        clubName: data.clubName || null,
        playerInvites: data.playerEmails,
      };

      await apiClient.post('/api/v1/coaches/onboarding', coachData);

      // Navigate to coach dashboard after successful onboarding
      navigate('/coach');
    } catch (err: any) {
      console.error('Onboarding failed:', err);
      setError(err.response?.data?.message || 'Kunne ikke fullføre registreringen. Vennligst prov igjen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-tier-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <TIERGolfFullLogo height={48} variant="dark" />
          </div>
          <PageTitle style={{ marginBottom: 0 }} className="text-2xl font-semibold text-tier-navy mb-2">
            Velkommen, Coach!
          </PageTitle>
          <p className="text-[16px] text-tier-text-secondary">
            Sett opp din trenerprofil for å komme i gang
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Personal Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-tier-navy/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-tier-navy" />
                </div>
                <CardTitle>Personlig informasjon</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-tier-navy">
                    Fornavn <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    value={data.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Ola"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-tier-navy">
                    Etternavn <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    value={data.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Nordmann"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-tier-navy">
                  Telefon <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  type="tel"
                  value={data.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+47 123 45 678"
                />
              </div>
            </CardContent>
          </Card>

          {/* 2. Coach Profile */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-tier-navy/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-tier-navy" />
                </div>
                <CardTitle>Trenerprofil</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Specializations */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-tier-navy">
                  Spesialiseringer (velg en eller flere)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SPECIALIZATIONS.map((spec) => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => handleSpecializationToggle(spec)}
                      className={`
                        px-4 py-3 rounded-lg border-2 text-left transition-all
                        ${data.specializations.includes(spec)
                          ? 'border-tier-navy bg-tier-navy/5 text-tier-navy'
                          : 'border-tier-border-default text-tier-text-secondary hover:border-tier-navy/50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 ${
                          data.specializations.includes(spec) ? 'text-tier-navy' : 'text-tier-text-tertiary'
                        }`} />
                        <span className="text-sm">{spec}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-tier-navy">
                  Erfaring som trener <span className="text-red-500">*</span>
                </label>
                <Select value={data.experienceYears} onValueChange={(val) => handleInputChange('experienceYears', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Velg erfaringsniva" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Certifications */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-tier-navy">
                  Sertifiseringer (valgfritt)
                </label>
                {data.certifications.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {data.certifications.map((cert) => (
                      <Badge key={cert} variant="secondary" className="flex items-center gap-1 py-1 px-3">
                        {cert}
                        <button
                          type="button"
                          onClick={() => handleRemoveCertification(cert)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    value={data.newCertification}
                    onChange={(e) => handleInputChange('newCertification', e.target.value)}
                    placeholder="f.eks. PGA-trener, NGF-instruktor"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCertification())}
                  />
                  <Button type="button" variant="outline" onClick={handleAddCertification}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-tier-navy">
                  Om deg (valgfritt)
                </label>
                <Textarea
                  value={data.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Fortell litt om din bakgrunn og treningsfilosofi..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* 3. Organization */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-tier-navy/10 flex items-center justify-center">
                  <Building className="w-5 h-5 text-tier-navy" />
                </div>
                <CardTitle>Tilknytning</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium text-tier-navy">
                  Type tilknytning <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleInputChange('organizationType', 'club')}
                    className={`
                      w-full px-4 py-3 rounded-lg border-2 text-left transition-all
                      ${data.organizationType === 'club'
                        ? 'border-tier-navy bg-tier-navy/5'
                        : 'border-tier-border-default hover:border-tier-navy/50'
                      }
                    `}
                  >
                    <div className="font-medium text-tier-navy">Klubbtrener</div>
                    <div className="text-sm text-tier-text-secondary">Ansatt eller tilknyttet en golfklubb</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('organizationType', 'independent')}
                    className={`
                      w-full px-4 py-3 rounded-lg border-2 text-left transition-all
                      ${data.organizationType === 'independent'
                        ? 'border-tier-navy bg-tier-navy/5'
                        : 'border-tier-border-default hover:border-tier-navy/50'
                      }
                    `}
                  >
                    <div className="font-medium text-tier-navy">Selvstendig trener</div>
                    <div className="text-sm text-tier-text-secondary">Freelance eller egen virksomhet</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('organizationType', 'federation')}
                    className={`
                      w-full px-4 py-3 rounded-lg border-2 text-left transition-all
                      ${data.organizationType === 'federation'
                        ? 'border-tier-navy bg-tier-navy/5'
                        : 'border-tier-border-default hover:border-tier-navy/50'
                      }
                    `}
                  >
                    <div className="font-medium text-tier-navy">Forbundstrener</div>
                    <div className="text-sm text-tier-text-secondary">Tilknyttet NGF eller regionalt forbund</div>
                  </button>
                </div>
              </div>

              {data.organizationType === 'club' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-tier-navy">
                    Klubbnavn <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    value={data.clubName}
                    onChange={(e) => handleInputChange('clubName', e.target.value)}
                    placeholder="Oslo Golfklubb"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* 4. Invite Players */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-tier-navy/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-tier-navy" />
                </div>
                <CardTitle>Inviter spillere</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-tier-text-secondary">
                Du kan invitere spillere na, eller gjore det senere fra dashboardet.
              </p>

              {data.playerEmails.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-tier-navy">
                    Spillere som vil bli invitert:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {data.playerEmails.map((email) => (
                      <Badge key={email} variant="secondary" className="flex items-center gap-2 py-1.5 px-3">
                        <Mail className="w-3 h-3" />
                        {email}
                        <button
                          type="button"
                          onClick={() => handleRemovePlayerEmail(email)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  type="email"
                  value={data.newPlayerEmail}
                  onChange={(e) => handleInputChange('newPlayerEmail', e.target.value)}
                  placeholder="spiller@example.com"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPlayerEmail())}
                />
                <Button type="button" variant="outline" onClick={handleAddPlayerEmail}>
                  <Plus className="w-4 h-4 mr-2" />
                  Legg til
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/login')}
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !data.organizationType || !data.experienceYears}
              className="px-8"
            >
              {isSubmitting ? 'Fullforer...' : 'Fullfør registrering'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
