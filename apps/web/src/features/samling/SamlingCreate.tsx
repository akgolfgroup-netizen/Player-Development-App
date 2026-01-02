/**
 * AK Golf Academy - Samling Create
 * Form for creating a new samling
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Save,
  Hotel,
  Car,
  Flag,
} from 'lucide-react';
import api from '../../services/api';

interface GolfCourse {
  id: string;
  name: string;
}

interface CreateSamlingForm {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: string;
  golfCourseId: string;
  address: string;
  accommodation: string;
  meetingPoint: string;
  transportInfo: string;
  maxParticipants: string;
  notes: string;
}

const SamlingCreate: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [golfCourses, setGolfCourses] = useState<GolfCourse[]>([]);

  const [form, setForm] = useState<CreateSamlingForm>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    venue: '',
    golfCourseId: '',
    address: '',
    accommodation: '',
    meetingPoint: '',
    transportInfo: '',
    maxParticipants: '',
    notes: '',
  });

  useEffect(() => {
    fetchGolfCourses();
  }, []);

  const fetchGolfCourses = async () => {
    try {
      const response = await api.get<{ success: boolean; data: GolfCourse[] }>('/golf-courses');
      if (response.data.success) {
        setGolfCourses(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching golf courses:', error);
    }
  };

  const handleInputChange = (field: keyof CreateSamlingForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!form.name.trim()) {
      setError('Navn er pakrevd');
      return;
    }
    if (!form.startDate) {
      setError('Startdato er pakrevd');
      return;
    }
    if (!form.endDate) {
      setError('Sluttdato er pakrevd');
      return;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError('Sluttdato ma vaere etter startdato');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        description: form.description || undefined,
        startDate: form.startDate,
        endDate: form.endDate,
        venue: form.venue || undefined,
        golfCourseId: form.golfCourseId || undefined,
        address: form.address || undefined,
        accommodation: form.accommodation || undefined,
        meetingPoint: form.meetingPoint || undefined,
        transportInfo: form.transportInfo || undefined,
        maxParticipants: form.maxParticipants ? parseInt(form.maxParticipants) : undefined,
        notes: form.notes || undefined,
      };

      const response = await api.post<{ success: boolean; data: { id: string } }>('/samling', payload);

      if (response.data.success) {
        navigate(`/coach/samlinger/${response.data.data.id}`);
      }
    } catch (error: unknown) {
      console.error('Error creating samling:', error);
      const apiError = error as { response?: { data?: { error?: string } } };
      setError(apiError.response?.data?.error || 'Kunne ikke opprette samling');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--border-secondary)',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    marginBottom: '6px',
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => navigate('/coach/samlinger')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            cursor: 'pointer',
            marginBottom: '16px',
          }}
        >
          <ArrowLeft size={18} />
          Tilbake til samlinger
        </button>

        <h1 style={{
          fontSize: '24px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: 0
        }}>
          Opprett ny samling
        </h1>
        <p style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          marginTop: '4px'
        }}>
          Fyll ut informasjon om samlingen
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: 'rgba(var(--error-rgb), 0.1)',
          border: '1px solid var(--error)',
          borderRadius: '8px',
          color: 'var(--error)',
          fontSize: '14px',
          marginBottom: '24px',
        }}>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Basic Info Section */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: '0 0 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Calendar size={18} />
            Grunnleggende informasjon
          </h2>

          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={labelStyle}>
                Navn pa samling *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="F.eks. Vintersamling 2026"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Beskrivelse
              </label>
              <textarea
                value={form.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Beskriv hva samlingen handler om..."
                rows={3}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>
                  Startdato *
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Sluttdato *
                </label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>
                Maks antall deltakere
              </label>
              <input
                type="number"
                value={form.maxParticipants}
                onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                placeholder="La sta tom for ubegrenset"
                min="1"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: '0 0 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <MapPin size={18} />
            Lokasjon
          </h2>

          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={labelStyle}>
                Sted / Venue
              </label>
              <input
                type="text"
                value={form.venue}
                onChange={(e) => handleInputChange('venue', e.target.value)}
                placeholder="F.eks. Bjaavann Golfklubb"
                style={inputStyle}
              />
            </div>

            {golfCourses.length > 0 && (
              <div>
                <label style={labelStyle}>
                  Golfbane
                </label>
                <select
                  value={form.golfCourseId}
                  onChange={(e) => handleInputChange('golfCourseId', e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Velg golfbane (valgfritt)</option>
                  {golfCourses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label style={labelStyle}>
                Adresse
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Full adresse"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Flag size={14} />
                  Motepunkt
                </span>
              </label>
              <input
                type="text"
                value={form.meetingPoint}
                onChange={(e) => handleInputChange('meetingPoint', e.target.value)}
                placeholder="Hvor skal deltakerne mote opp?"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Logistics Section */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: '0 0 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Hotel size={18} />
            Praktisk informasjon
          </h2>

          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={labelStyle}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Hotel size={14} />
                  Overnatting
                </span>
              </label>
              <textarea
                value={form.accommodation}
                onChange={(e) => handleInputChange('accommodation', e.target.value)}
                placeholder="Informasjon om overnatting..."
                rows={2}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                }}
              />
            </div>

            <div>
              <label style={labelStyle}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Car size={14} />
                  Transport
                </span>
              </label>
              <textarea
                value={form.transportInfo}
                onChange={(e) => handleInputChange('transportInfo', e.target.value)}
                placeholder="Informasjon om transport..."
                rows={2}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                }}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Andre notater
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Evt. andre notater om samlingen..."
                rows={3}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                }}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
        }}>
          <button
            type="button"
            onClick={() => navigate('/coach/samlinger')}
            style={{
              padding: '12px 20px',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Avbryt
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            <Save size={18} />
            {loading ? 'Oppretter...' : 'Opprett samling'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SamlingCreate;
