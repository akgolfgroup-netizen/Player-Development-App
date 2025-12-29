import React, { useState, useEffect } from 'react';
import {
  Cloud, Sun, CloudRain, Wind, Thermometer,
  Droplets, ArrowUp, MapPin, RefreshCw, ChevronRight,
  CloudSnow, CloudLightning, CloudFog
} from 'lucide-react';
import { weatherAPI, golfCoursesAPI } from '../../services/api';

// Weather icon mapping
const getWeatherIcon = (symbol, size = 24) => {
  if (!symbol) return <Cloud size={size} />;

  const iconMap = {
    clearsky: Sun,
    fair: Sun,
    partlycloudy: Cloud,
    cloudy: Cloud,
    rain: CloudRain,
    lightrain: CloudRain,
    heavyrain: CloudRain,
    sleet: CloudSnow,
    snow: CloudSnow,
    fog: CloudFog,
    thunder: CloudLightning,
  };

  // Find matching icon
  const key = Object.keys(iconMap).find(k => symbol.toLowerCase().includes(k));
  const Icon = key ? iconMap[key] : Cloud;

  return <Icon size={size} />;
};

// Playability color mapping using semantic tokens
const getPlayabilityColor = (playability) => {
  switch (playability) {
    case 'excellent': return 'var(--success)';
    case 'good': return 'var(--success)';
    case 'fair': return 'var(--warning)';
    case 'poor': return 'var(--warning)';
    case 'unplayable': return 'var(--error)';
    default: return 'var(--text-secondary)';
  }
};

// Wind direction arrow component
const WindArrow = ({ direction, size = 16 }) => (
  <div style={{
    transform: `rotate(${direction + 180}deg)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <ArrowUp size={size} />
  </div>
);

const WeatherWidget = ({ courseId, showForecast = true, compact = false }) => {
  const [weather, setWeather] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(courseId || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await golfCoursesAPI.getNorwegian();
        if (response.data?.clubs) {
          const allCourses = response.data.clubs.flatMap(club =>
            club.courses.map(course => ({
              id: course.id,
              name: course.name,
              clubName: club.name,
              city: club.city,
            }))
          );
          setCourses(allCourses);
          if (!selectedCourse && allCourses.length > 0) {
            setSelectedCourse(allCourses[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };
    fetchCourses();
  }, []);

  // Fetch weather when course changes
  useEffect(() => {
    if (!selectedCourse) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await weatherAPI.getCourseWeather(selectedCourse);
        if (response.data?.success) {
          setWeather(response.data.data);
        } else {
          setError('Kunne ikke hente værdata');
        }
      } catch (err) {
        setError('Feil ved henting av værdata');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [selectedCourse]);

  const handleRefresh = () => {
    if (selectedCourse) {
      setLoading(true);
      weatherAPI.getCourseWeather(selectedCourse)
        .then(response => {
          if (response.data?.success) {
            setWeather(response.data.data);
          }
        })
        .finally(() => setLoading(false));
    }
  };

  if (loading && !weather) {
    return (
      <div style={{
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-default)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Cloud size={20} style={{ color: 'var(--accent)' }} />
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Golfvær</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '120px',
          color: 'var(--text-secondary)',
        }}>
          <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-default)',
      }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Cloud size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      </div>
    );
  }

  const current = weather?.weather?.current;
  const conditions = weather?.weather?.golfConditions;

  return (
    <div style={{
      borderRadius: 'var(--radius-lg)',
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-default)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cloud size={20} style={{ color: 'var(--accent)' }} />
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Golfvær</span>
        </div>
        <button
          onClick={handleRefresh}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Oppdater"
        >
          <RefreshCw size={16} style={{ opacity: loading ? 0.5 : 1 }} />
        </button>
      </div>

      {/* Course Selector */}
      {courses.length > 1 && (
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-default)' }}>
          <select
            value={selectedCourse || ''}
            onChange={(e) => setSelectedCourse(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.clubName} - {course.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Main Weather Display */}
      <div style={{ padding: '20px' }}>
        {/* Current Weather */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
          {/* Temperature & Icon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flex: 1,
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, var(--accent-light) 0%, var(--accent) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}>
              {getWeatherIcon(current?.symbol, 28)}
            </div>
            <div>
              <div style={{
                fontSize: '32px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}>
                {current?.temperature?.toFixed(0) || '--'}°
              </div>
              <div style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginTop: '2px',
              }}>
                Føles som {current?.feelsLike?.toFixed(0) || '--'}°
              </div>
            </div>
          </div>

          {/* Golf Conditions Score */}
          <div style={{
            textAlign: 'center',
            padding: '12px 16px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: `${getPlayabilityColor(conditions?.playability)}15`,
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 700,
              color: getPlayabilityColor(conditions?.playability),
            }}>
              {conditions?.score || '--'}
            </div>
            <div style={{
              fontSize: '10px',
              fontWeight: 600,
              color: getPlayabilityColor(conditions?.playability),
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {conditions?.playability || 'N/A'}
            </div>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '16px',
        }}>
          {/* Wind */}
          <div style={{
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-secondary)',
            textAlign: 'center',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              marginBottom: '4px',
            }}>
              <Wind size={14} style={{ color: 'var(--text-secondary)' }} />
              {current?.windDirection && (
                <WindArrow direction={current.windDirection} size={12} />
              )}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {current?.windSpeed?.toFixed(1) || '--'} m/s
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
              {current?.windDirectionText || '--'}
            </div>
          </div>

          {/* Humidity */}
          <div style={{
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-secondary)',
            textAlign: 'center',
          }}>
            <Droplets size={14} style={{ color: 'var(--text-secondary)', marginBottom: '4px' }} />
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {current?.humidity?.toFixed(0) || '--'}%
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
              Luftfuktighet
            </div>
          </div>

          {/* Precipitation */}
          <div style={{
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-secondary)',
            textAlign: 'center',
          }}>
            <CloudRain size={14} style={{ color: 'var(--text-secondary)', marginBottom: '4px' }} />
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {current?.precipitation?.toFixed(1) || '0'} mm
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
              Nedbør
            </div>
          </div>
        </div>

        {/* Condition Factors */}
        {conditions?.factors && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-secondary)',
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px',
            }}>
              Spilleforhold
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {Object.entries(conditions.factors).map(([key, factor]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    flex: 1,
                    height: '4px',
                    borderRadius: '2px',
                    backgroundColor: 'var(--border-default)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${factor.score}%`,
                      borderRadius: '2px',
                      backgroundColor: factor.score >= 70 ? 'var(--success)' : factor.score >= 40 ? 'var(--warning)' : 'var(--error)',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                  <span style={{
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    minWidth: '80px',
                  }}>
                    {factor.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendation */}
        {conditions?.recommendation && (
          <div style={{
            marginTop: '12px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: `${getPlayabilityColor(conditions.playability)}10`,
            borderLeft: `3px solid ${getPlayabilityColor(conditions.playability)}`,
          }}>
            <p style={{
              margin: 0,
              fontSize: '13px',
              color: 'var(--text-primary)',
              fontWeight: 500,
            }}>
              {conditions.recommendation}
            </p>
          </div>
        )}

        {/* Hourly Forecast Preview */}
        {showForecast && weather?.weather?.hourly && (
          <div style={{ marginTop: '16px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px',
            }}>
              Neste timer
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '4px',
            }}>
              {weather.weather.hourly.slice(1, 7).map((hour, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: '0 0 auto',
                    width: '60px',
                    padding: '10px 8px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-secondary)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {new Date(hour.time).getHours()}:00
                  </div>
                  {getWeatherIcon(hour.symbol, 18)}
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                    {hour.temperature?.toFixed(0)}°
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                    {hour.windSpeed?.toFixed(0)} m/s
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location & Update Time */}
        <div style={{
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-default)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px',
          color: 'var(--text-tertiary)',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={12} />
            {weather?.clubName || 'Ukjent bane'}
          </span>
          <span>
            Oppdatert: {weather?.weather?.updatedAt
              ? new Date(weather.weather.updatedAt).toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })
              : '--:--'}
          </span>
        </div>
      </div>

      {/* CSS for spin animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default WeatherWidget;
