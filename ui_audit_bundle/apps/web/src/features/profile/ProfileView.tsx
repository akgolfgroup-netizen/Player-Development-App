// @ts-nocheck
import React, { useState } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, Flag, Award,
  Target, Heart, Edit2, ChevronRight, Trophy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Separator,
} from '../../components/shadcn';
import { SectionTitle } from '../../components/typography';
import { HandicapDisplay } from '../../components/shadcn/golf';
import { cn } from 'lib/utils';

// ============================================================================
// TYPES
// ============================================================================

interface EmergencyContact {
  name?: string;
  phone?: string;
  relation?: string;
}

interface Profile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  profileImageUrl?: string;
  dateOfBirth?: string;
  birthDate?: string;
  gender?: string;
  club?: string;
  category?: string;
  handicap?: number;
  averageScore?: number;
  wagrRank?: number;
  weeklyTrainingHours?: number;
  currentPeriod?: string;
  emergencyContact?: EmergencyContact;
}

interface ProfileViewProps {
  profile: Profile;
  onUpdate?: (data: Partial<Profile>) => Promise<void>;
}

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

interface StatItemProps {
  value: string | number | null | undefined;
  label: string;
  highlight?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ value, label, highlight }) => (
  <div className="flex flex-col items-center text-center p-2">
    <span className={cn(
      "text-2xl font-bold",
      highlight ? "text-ak-primary" : "text-text-primary"
    )}>
      {value || '-'}
    </span>
    <span className="text-xs text-text-secondary mt-1">{label}</span>
  </div>
);

// ============================================================================
// PROFILE FIELD COMPONENT
// ============================================================================

interface ProfileFieldProps {
  icon: React.ReactNode;
  label: string;
  value?: string | number | null;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="text-text-secondary mt-0.5">{icon}</div>
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-text-secondary uppercase tracking-wide">{label}</span>
      <span className="text-sm text-text-primary">{value || '-'}</span>
    </div>
  </div>
);

// ============================================================================
// PROFILE SECTION COMPONENT
// ============================================================================

interface ProfileSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ icon, title, children }) => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-center gap-3">
        <div className="text-ak-primary">{icon}</div>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </div>
    </CardHeader>
    <Separator />
    <CardContent className="pt-4 space-y-4">
      {children}
    </CardContent>
  </Card>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ProfileView: React.FC<ProfileViewProps> = ({ profile, onUpdate }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const formatDate = (dateStr?: string | null): string => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateAge = (birthDate?: string | null): number | null => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getGenderLabel = (gender?: string): string => {
    if (!gender) return '-';
    if (gender === 'male') return 'Mann';
    if (gender === 'female') return 'Kvinne';
    return gender;
  };

  const getPeriodLabel = (period?: string): string => {
    if (!period) return '-';
    const labels: Record<string, string> = {
      G: 'Grunnleggende',
      S: 'Spesifikk',
      T: 'Turnering',
      E: 'Evaluering',
    };
    return labels[period] || period;
  };

  const age = calculateAge(profile.dateOfBirth || profile.birthDate);
  const initials = `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Profile Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.profileImageUrl} alt={profile.firstName} />
                <AvatarFallback className="text-2xl font-semibold bg-ak-primary text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <SectionTitle className="text-2xl font-bold">
                  {profile.firstName} {profile.lastName}
                </SectionTitle>
                <p className="text-sm text-text-secondary">
                  {profile.club || 'Ingen klubb registrert'}
                  {profile.category && ` • Kategori ${profile.category}`}
                </p>
                {profile.handicap && (
                  <Badge className="mt-2 bg-achievement text-white border-0">
                    <Trophy className="w-3 h-3 mr-1" />
                    HCP {profile.handicap}
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Rediger profil
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardContent className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatItem value={profile.handicap} label="Handicap" highlight />
            <StatItem value={profile.averageScore} label="Snittslag" />
            <StatItem value={profile.category} label="Kategori" />
            <StatItem value={age} label="Alder" />
          </div>
        </CardContent>
      </Card>

      {/* Profile Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal Information */}
        <ProfileSection icon={<User className="w-5 h-5" />} title="Personlig informasjon">
          <ProfileField
            icon={<User className="w-4 h-4" />}
            label="Navn"
            value={`${profile.firstName || ''} ${profile.lastName || ''}`.trim()}
          />
          <ProfileField
            icon={<Calendar className="w-4 h-4" />}
            label="Fødselsdato"
            value={formatDate(profile.dateOfBirth || profile.birthDate)}
          />
          <ProfileField
            icon={<Flag className="w-4 h-4" />}
            label="Kjønn"
            value={getGenderLabel(profile.gender)}
          />
        </ProfileSection>

        {/* Contact Information */}
        <ProfileSection icon={<Mail className="w-5 h-5" />} title="Kontaktinformasjon">
          <ProfileField
            icon={<Mail className="w-4 h-4" />}
            label="E-post"
            value={profile.email}
          />
          <ProfileField
            icon={<Phone className="w-4 h-4" />}
            label="Telefon"
            value={profile.phone}
          />
          <ProfileField
            icon={<MapPin className="w-4 h-4" />}
            label="Adresse"
            value={profile.address}
          />
        </ProfileSection>

        {/* Golf Profile */}
        <ProfileSection icon={<Target className="w-5 h-5" />} title="Golfprofil">
          <ProfileField
            icon={<Flag className="w-4 h-4" />}
            label="Hjemmeklubb"
            value={profile.club}
          />
          <ProfileField
            icon={<Award className="w-4 h-4" />}
            label="Handicap"
            value={profile.handicap}
          />
          <ProfileField
            icon={<Target className="w-4 h-4" />}
            label="Snittscore"
            value={profile.averageScore}
          />
          <ProfileField
            icon={<Award className="w-4 h-4" />}
            label="WAGR-rangering"
            value={profile.wagrRank}
          />
        </ProfileSection>

        {/* Training */}
        <ProfileSection icon={<Calendar className="w-5 h-5" />} title="Trening">
          <ProfileField
            icon={<Calendar className="w-4 h-4" />}
            label="Timer per uke"
            value={profile.weeklyTrainingHours ? `${profile.weeklyTrainingHours} timer` : undefined}
          />
          <ProfileField
            icon={<Target className="w-4 h-4" />}
            label="Gjeldende periode"
            value={getPeriodLabel(profile.currentPeriod)}
          />
        </ProfileSection>

        {/* Emergency Contact */}
        {profile.emergencyContact && (
          <ProfileSection icon={<Heart className="w-5 h-5" />} title="Nødkontakt">
            <ProfileField
              icon={<User className="w-4 h-4" />}
              label="Navn"
              value={profile.emergencyContact.name}
            />
            <ProfileField
              icon={<Phone className="w-4 h-4" />}
              label="Telefon"
              value={profile.emergencyContact.phone}
            />
            <ProfileField
              icon={<User className="w-4 h-4" />}
              label="Relasjon"
              value={profile.emergencyContact.relation}
            />
          </ProfileSection>
        )}
      </div>

      {/* Update Profile Link */}
      <Card className="bg-background-elevated border-0">
        <CardContent className="p-6 text-center">
          <Button onClick={() => navigate('/profil/oppdater')} size="lg">
            Oppdater fullstendig profil
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-sm text-text-secondary mt-3">
            Gå gjennom alle profildata inkludert skole, helse og mål
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileView;
