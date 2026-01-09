/**
 * PlayerOnboardingPage
 *
 * Single-page onboarding flow for new players
 * All steps collected on one page with sections
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Textarea } from '../../components/shadcn';
import { User, Trophy, Target, Users, CheckCircle } from 'lucide-react';
import { TIERGolfFullLogo } from '../../components/branding/TIERGolfFullLogo';

interface OnboardingData {
  // Personal information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | '';
  phone: string;

  // Golf profile
  handicap: string;
  category: 'A' | 'B' | 'C' | 'D' | '';
  club: string;
  school: string;

  // Goals
  goals: string[];
  customGoal: string;

  // Coach selection
  coachId: string;

  // Emergency contact
  emergencyContactFirstName: string;
  emergencyContactLastName: string;
  emergencyContactPhone: string;
  emergencyContactEmail: string;
}

export default function PlayerOnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<OnboardingData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    handicap: '',
    category: '',
    club: '',
    school: '',
    goals: [],
    customGoal: '',
    coachId: '',
    emergencyContactFirstName: '',
    emergencyContactLastName: '',
    emergencyContactPhone: '',
    emergencyContactEmail: '',
  });

  const [coaches, setCoaches] = useState<Array<{ id: string; firstName: string; lastName: string }>>([]);

  // Calculate if player is under 18
  const isUnder18 = useMemo(() => {
    if (!data.dateOfBirth) return false;
    const today = new Date();
    const birthDate = new Date(data.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age < 18;
  }, [data.dateOfBirth]);

  // Fetch coaches on mount
  React.useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await apiClient.get('/api/v1/coaches');
        setCoaches(response.data.data || []);
      } catch (err) {
        console.error('Failed to fetch coaches:', err);
      }
    };
    fetchCoaches();
  }, []);

  const handleInputChange = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoalToggle = (goal: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Combine standard goals with custom goal
      const allGoals = [...data.goals];
      if (data.customGoal.trim()) {
        allGoals.push(data.customGoal.trim());
      }

      const playerData = {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        phone: data.phone,
        handicap: parseFloat(data.handicap) || null,
        category: data.category || 'D',
        club: data.club,
        school: data.school,
        goals: allGoals,
        coachId: data.coachId && data.coachId !== 'none' ? data.coachId : null,
        emergencyContact: {
          name: `${data.emergencyContactFirstName} ${data.emergencyContactLastName}`.trim(),
          phone: data.emergencyContactPhone,
          email: data.emergencyContactEmail,
        },
      };

      await apiClient.post('/api/v1/players/onboarding', playerData);

      // Navigate to dashboard after successful onboarding
      navigate('/');
    } catch (err: any) {
      console.error('Onboarding failed:', err);
      setError(err.response?.data?.message || 'Kunne ikke fullføre registreringen. Vennligst prøv igjen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const predefinedGoals = [
    'Bli profesjonell golfer',
    'Spille på landslaget',
    'Vinne junior-mesterskap',
    'Nå kategori A',
    'Forbedre handicap med 5 slag',
    'Kvalifisere til nasjonale turneringer',
  ];

  return (
    <div className="min-h-screen bg-tier-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <TIERGolfFullLogo height={48} variant="dark" />
          </div>
          <p className="text-[16px] text-tier-text-secondary">
            Fyll ut informasjonen nedenfor for å komme i gang
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-tier-navy">
                    Fødselsdato <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    type="date"
                    value={data.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-tier-navy">
                    Kjønn <span className="text-red-500">*</span>
                  </label>
                  <Select value={data.gender} onValueChange={(val) => handleInputChange('gender', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Velg kjønn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Mann</SelectItem>
                      <SelectItem value="female">Kvinne</SelectItem>
                      <SelectItem value="other">Annet</SelectItem>
                    </SelectContent>
                  </Select>
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

          {/* 2. Golf Profile */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-tier-navy/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-tier-navy" />
                </div>
                <CardTitle>Golfprofil</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-tier-navy">
                    Handicap
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={data.handicap}
                    onChange={(e) => handleInputChange('handicap', e.target.value)}
                    placeholder="5.4"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-tier-navy">
                    Spiller Kategori
                  </label>
                  <p className="text-xs text-tier-text-secondary mb-2">
                    Basert på snittscore fra forrige fullverdige golf sesong
                  </p>
                  <Select value={data.category} onValueChange={(val) => handleInputChange('category', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Velg kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Kategori A (Handicap 0-4.4)</SelectItem>
                      <SelectItem value="B">Kategori B (Handicap 4.5-11.4)</SelectItem>
                      <SelectItem value="C">Kategori C (Handicap 11.5-18.4)</SelectItem>
                      <SelectItem value="D">Kategori D (Handicap 18.5+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-tier-navy">
                    Klubb
                  </label>
                  <Input
                    value={data.club}
                    onChange={(e) => handleInputChange('club', e.target.value)}
                    placeholder="Oslo GK"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-tier-navy">
                  Idrettsskole
                </label>
                <Select value={data.school} onValueChange={(val) => handleInputChange('school', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Velg idrettsskole (valgfritt)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ingen idrettsskole</SelectItem>

                    {/* WANG Toppidrett */}
                    <SelectItem value="WANG Toppidrett Oslo">WANG Toppidrett Oslo</SelectItem>
                    <SelectItem value="WANG Toppidrett Romerike">WANG Toppidrett Romerike</SelectItem>
                    <SelectItem value="WANG Toppidrett Tønsberg">WANG Toppidrett Tønsberg</SelectItem>
                    <SelectItem value="WANG Toppidrett Fredrikstad">WANG Toppidrett Fredrikstad</SelectItem>
                    <SelectItem value="WANG Toppidrett Stavanger">WANG Toppidrett Stavanger</SelectItem>

                    {/* NTG */}
                    <SelectItem value="NTG Bærum">NTG Bærum</SelectItem>
                    <SelectItem value="NTG Bergen">NTG Bergen</SelectItem>

                    {/* WANG UNG */}
                    <SelectItem value="WANG UNG Oslo">WANG UNG Oslo</SelectItem>
                    <SelectItem value="WANG UNG Romerike">WANG UNG Romerike</SelectItem>
                    <SelectItem value="WANG UNG Sandefjord">WANG UNG Sandefjord</SelectItem>
                    <SelectItem value="WANG UNG Fredrikstad">WANG UNG Fredrikstad</SelectItem>
                    <SelectItem value="WANG UNG Stavanger">WANG UNG Stavanger</SelectItem>

                    {/* NTG U */}
                    <SelectItem value="NTG U Bærum">NTG U Bærum</SelectItem>

                    {/* TEAM Norway */}
                    <SelectItem value="TEAM Norway Ung">TEAM Norway Ung</SelectItem>
                    <SelectItem value="TEAM Norway Junior">TEAM Norway Junior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 3. Goals and Ambitions */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-tier-navy/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-tier-navy" />
                </div>
                <CardTitle>Mål og ambisjoner</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-tier-navy">
                  Velg dine mål (du kan velge flere)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {predefinedGoals.map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => handleGoalToggle(goal)}
                      className={`
                        px-4 py-3 rounded-lg border-2 text-left transition-all
                        ${data.goals.includes(goal)
                          ? 'border-tier-navy bg-tier-navy/5 text-tier-navy'
                          : 'border-tier-border-default text-tier-text-secondary hover:border-tier-navy/50'
                        }
                      `}
                    >
                      <div className="flex items-start gap-2">
                        <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          data.goals.includes(goal) ? 'text-tier-navy' : 'text-tier-text-tertiary'
                        }`} />
                        <span className="text-sm">{goal}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-tier-navy">
                  Egendefinert mål (valgfritt)
                </label>
                <Textarea
                  value={data.customGoal}
                  onChange={(e) => handleInputChange('customGoal', e.target.value)}
                  placeholder="Beskriv ditt eget mål..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* 4. Coach Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-tier-navy/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-tier-navy" />
                </div>
                <CardTitle>Velg trener</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-tier-navy">
                  Trener (valgfritt)
                </label>
                <Select value={data.coachId} onValueChange={(val) => handleInputChange('coachId', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Velg trener" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ingen trener (kan endres senere)</SelectItem>
                    {coaches.map((coach) => (
                      <SelectItem key={coach.id} value={coach.id}>
                        {coach.firstName} {coach.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 5. Emergency Contact / Fullmakt */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {isUnder18 ? 'Fullmakt (Foreldre/foresatt)' : 'Nødkontakt'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-tier-navy">
                    Fornavn {isUnder18 && <span className="text-status-error">*</span>}
                  </label>
                  <Input
                    value={data.emergencyContactFirstName}
                    onChange={(e) => handleInputChange('emergencyContactFirstName', e.target.value)}
                    placeholder="Ola"
                    required={isUnder18}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-tier-navy">
                    Etternavn {isUnder18 && <span className="text-status-error">*</span>}
                  </label>
                  <Input
                    value={data.emergencyContactLastName}
                    onChange={(e) => handleInputChange('emergencyContactLastName', e.target.value)}
                    placeholder="Nordmann"
                    required={isUnder18}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-tier-navy">
                    Telefon {isUnder18 && <span className="text-status-error">*</span>}
                  </label>
                  <Input
                    type="tel"
                    value={data.emergencyContactPhone}
                    onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                    placeholder="+47 123 45 678"
                    required={isUnder18}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-tier-navy">
                    E-post {isUnder18 && <span className="text-status-error">*</span>}
                  </label>
                  <Input
                    type="email"
                    value={data.emergencyContactEmail}
                    onChange={(e) => handleInputChange('emergencyContactEmail', e.target.value)}
                    placeholder="forelder@example.com"
                    required={isUnder18}
                  />
                </div>
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
              disabled={isSubmitting}
              className="px-8"
            >
              {isSubmitting ? 'Fullfører...' : 'Fullfør registrering'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
