import React, { useState } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, Flag, Award,
  Target, School, Heart, Edit2, Save, X, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * ProfileView - Displays player profile for existing users
 * Shows profile information in a clean, editable format
 */
const ProfileView = ({ profile, onUpdate }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateAge = (birthDate) => {
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

  const handleStartEdit = () => {
    setEditData({ ...profile });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditData({});
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (onUpdate) {
      await onUpdate(editData);
    }
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const age = calculateAge(profile.dateOfBirth || profile.birthDate);

  return (
    <div style={styles.container}>
      {/* Profile Header Card */}
      <div style={styles.headerCard}>
        <div style={styles.avatarSection}>
          <div style={styles.avatar}>
            {profile.profileImageUrl ? (
              <img src={profile.profileImageUrl} alt={profile.firstName} style={styles.avatarImage} />
            ) : (
              <span style={styles.avatarInitials}>
                {profile.firstName?.[0]}{profile.lastName?.[0]}
              </span>
            )}
          </div>
          <div style={styles.headerInfo}>
            <h1 style={styles.name}>{profile.firstName} {profile.lastName}</h1>
            <p style={styles.subtitle}>
              {profile.club || 'Ingen klubb registrert'}
              {profile.category && ` • Kategori ${profile.category}`}
            </p>
            {profile.handicap && (
              <div style={styles.badge}>
                <Award size={14} />
                <span>HCP {profile.handicap}</span>
              </div>
            )}
          </div>
        </div>
        <button
          style={styles.editButton}
          onClick={handleStartEdit}
        >
          <Edit2 size={16} />
          <span>Rediger profil</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statItem}>
          <span style={styles.statValue}>{profile.handicap || '-'}</span>
          <span style={styles.statLabel}>Handicap</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statValue}>{profile.averageScore || '-'}</span>
          <span style={styles.statLabel}>Snittslag</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statValue}>{profile.category || '-'}</span>
          <span style={styles.statLabel}>Kategori</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statValue}>{age || '-'}</span>
          <span style={styles.statLabel}>Alder</span>
        </div>
      </div>

      {/* Profile Sections */}
      <div style={styles.sectionsGrid}>
        {/* Personal Information */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <User size={20} style={styles.sectionIcon} />
            <h2 style={styles.sectionTitle}>Personlig informasjon</h2>
          </div>
          <div style={styles.sectionContent}>
            <ProfileField
              icon={<User size={16} />}
              label="Navn"
              value={`${profile.firstName} ${profile.lastName}`}
            />
            <ProfileField
              icon={<Calendar size={16} />}
              label="Fødselsdato"
              value={formatDate(profile.dateOfBirth || profile.birthDate)}
            />
            <ProfileField
              icon={<Flag size={16} />}
              label="Kjønn"
              value={profile.gender === 'male' ? 'Mann' : profile.gender === 'female' ? 'Kvinne' : profile.gender || '-'}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Mail size={20} style={styles.sectionIcon} />
            <h2 style={styles.sectionTitle}>Kontaktinformasjon</h2>
          </div>
          <div style={styles.sectionContent}>
            <ProfileField
              icon={<Mail size={16} />}
              label="E-post"
              value={profile.email}
            />
            <ProfileField
              icon={<Phone size={16} />}
              label="Telefon"
              value={profile.phone}
            />
            <ProfileField
              icon={<MapPin size={16} />}
              label="Adresse"
              value={profile.address || '-'}
            />
          </div>
        </div>

        {/* Golf Profile */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Target size={20} style={styles.sectionIcon} />
            <h2 style={styles.sectionTitle}>Golfprofil</h2>
          </div>
          <div style={styles.sectionContent}>
            <ProfileField
              icon={<Flag size={16} />}
              label="Hjemmeklubb"
              value={profile.club}
            />
            <ProfileField
              icon={<Award size={16} />}
              label="Handicap"
              value={profile.handicap}
            />
            <ProfileField
              icon={<Target size={16} />}
              label="Snittscore"
              value={profile.averageScore}
            />
            <ProfileField
              icon={<Award size={16} />}
              label="WAGR-rangering"
              value={profile.wagrRank}
            />
          </div>
        </div>

        {/* Training */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Calendar size={20} style={styles.sectionIcon} />
            <h2 style={styles.sectionTitle}>Trening</h2>
          </div>
          <div style={styles.sectionContent}>
            <ProfileField
              icon={<Calendar size={16} />}
              label="Timer per uke"
              value={profile.weeklyTrainingHours ? `${profile.weeklyTrainingHours} timer` : '-'}
            />
            <ProfileField
              icon={<Target size={16} />}
              label="Gjeldende periode"
              value={profile.currentPeriod === 'G' ? 'Grunnleggende' :
                     profile.currentPeriod === 'S' ? 'Spesifikk' :
                     profile.currentPeriod === 'T' ? 'Turnering' :
                     profile.currentPeriod === 'E' ? 'Evaluering' : profile.currentPeriod || '-'}
            />
          </div>
        </div>

        {/* Emergency Contact */}
        {profile.emergencyContact && (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <Heart size={20} style={styles.sectionIcon} />
              <h2 style={styles.sectionTitle}>Nødkontakt</h2>
            </div>
            <div style={styles.sectionContent}>
              <ProfileField
                icon={<User size={16} />}
                label="Navn"
                value={profile.emergencyContact.name}
              />
              <ProfileField
                icon={<Phone size={16} />}
                label="Telefon"
                value={profile.emergencyContact.phone}
              />
              <ProfileField
                icon={<User size={16} />}
                label="Relasjon"
                value={profile.emergencyContact.relation}
              />
            </div>
          </div>
        )}
      </div>

      {/* Update Profile Link */}
      <div style={styles.updateSection}>
        <button
          style={styles.updateButton}
          onClick={() => navigate('/profil/oppdater')}
        >
          <span>Oppdater fullstendig profil</span>
          <ChevronRight size={20} />
        </button>
        <p style={styles.updateHint}>
          Gå gjennom alle profildata inkludert skole, helse og mål
        </p>
      </div>
    </div>
  );
};

// Helper component for displaying profile fields
const ProfileField = ({ icon, label, value }) => (
  <div style={styles.field}>
    <div style={styles.fieldIcon}>{icon}</div>
    <div style={styles.fieldContent}>
      <span style={styles.fieldLabel}>{label}</span>
      <span style={styles.fieldValue}>{value || '-'}</span>
    </div>
  </div>
);

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: 'var(--spacing-6)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-6)',
  },
  headerCard: {
    backgroundColor: 'var(--card)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-6)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    boxShadow: 'var(--shadow-card)',
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-4)',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarInitials: {
    fontSize: '28px',
    fontWeight: '600',
    color: 'white',
  },
  headerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  name: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '8px',
    padding: '4px 12px',
    backgroundColor: 'var(--gold)',
    color: 'white',
    borderRadius: 'var(--radius-full)',
    fontSize: '13px',
    fontWeight: '600',
  },
  editButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: 'transparent',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 'var(--spacing-4)',
    backgroundColor: 'var(--card)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-5)',
    boxShadow: 'var(--shadow-card)',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: 'var(--spacing-2)',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--accent)',
  },
  statLabel: {
    fontSize: '13px',
    color: 'var(--text-tertiary)',
    marginTop: '4px',
  },
  sectionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'var(--spacing-4)',
  },
  section: {
    backgroundColor: 'var(--card)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-5)',
    boxShadow: 'var(--shadow-card)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    marginBottom: 'var(--spacing-4)',
    paddingBottom: 'var(--spacing-3)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  sectionIcon: {
    color: 'var(--accent)',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    margin: 0,
  },
  sectionContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  field: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--spacing-3)',
  },
  fieldIcon: {
    color: 'var(--text-tertiary)',
    marginTop: '2px',
  },
  fieldContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  fieldLabel: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  fieldValue: {
    fontSize: '15px',
    color: 'var(--text-primary)',
  },
  updateSection: {
    backgroundColor: 'var(--bg-elevated)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-5)',
    textAlign: 'center',
  },
  updateButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: 'var(--accent)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
  updateHint: {
    fontSize: '13px',
    color: 'var(--text-tertiary)',
    marginTop: 'var(--spacing-2)',
    margin: 0,
    marginTop: '12px',
  },
};

// Responsive adjustments
if (typeof window !== 'undefined' && window.innerWidth < 768) {
  styles.sectionsGrid.gridTemplateColumns = '1fr';
  styles.statsRow.gridTemplateColumns = 'repeat(2, 1fr)';
}

export default ProfileView;
