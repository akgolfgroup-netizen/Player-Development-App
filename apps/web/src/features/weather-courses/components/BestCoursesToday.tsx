/**
 * Best Courses Today
 * Shows courses with best weather conditions for playing
 */

import React from 'react';
import { Trophy, MapPin, Wind, Droplets, Thermometer, Eye } from 'lucide-react';
import { useBestCoursesToday } from '../../../hooks/useWeather';

const BestCoursesToday: React.FC = () => {
  const { courses, loading, error } = useBestCoursesToday(15);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-tier-border-default p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tier-info mx-auto mb-4"></div>
        <p className="text-tier-text-secondary">Laster beste baner i dag...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-tier-border-default p-8 text-center">
        <div className="text-tier-error text-4xl mb-2">⚠️</div>
        <p className="text-tier-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-tier-success-light border border-tier-success rounded-xl p-4">
        <p className="text-sm text-tier-navy">
          <strong className="font-semibold">🏆 {courses.length} baner</strong> med best værforhold i dag - sortert etter temperatur, vind og nedbør.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((item: any, index: number) => (
          <div
            key={item.course?.id || index}
            className="bg-white rounded-xl border border-tier-border-default p-6 hover:border-tier-info hover:shadow-md transition-all"
          >
            {/* Rank Badge */}
            <div className="flex items-start justify-between mb-3">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${
                  index === 0 ? 'bg-tier-warning' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-tier-navy'
                }`}
              >
                #{index + 1}
              </div>
              <Trophy className={index < 3 ? 'text-tier-warning' : 'text-tier-text-secondary'} size={20} />
            </div>

            {/* Course Info */}
            <h3 className="text-lg font-semibold text-tier-navy mb-1">{item.course?.name || 'Ukjent bane'}</h3>
            <div className="flex items-center gap-1 text-sm text-tier-text-secondary mb-4">
              <MapPin size={14} />
              <span>{item.course?.city || 'N/A'}</span>
            </div>

            {/* Weather Details */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-tier-text-secondary">
                  <Thermometer size={16} />
                  <span>Temperatur</span>
                </div>
                <span className="font-semibold text-tier-navy">{item.weather?.temperature || '--'}°C</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-tier-text-secondary">
                  <Wind size={16} />
                  <span>Vind</span>
                </div>
                <span className="font-semibold text-tier-navy">{item.weather?.windSpeed || '--'} m/s</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-tier-text-secondary">
                  <Droplets size={16} />
                  <span>Nedbør</span>
                </div>
                <span className="font-semibold text-tier-navy">{item.weather?.precipitation || '0'} mm</span>
              </div>

              {item.weather?.visibility && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-tier-text-secondary">
                    <Eye size={16} />
                    <span>Sikt</span>
                  </div>
                  <span className="font-semibold text-tier-navy">{item.weather.visibility} km</span>
                </div>
              )}
            </div>

            {/* Weather Score */}
            {item.score !== undefined && (
              <div className="mt-4 pt-4 border-t border-tier-border-default">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-tier-text-secondary">Værscore</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-tier-surface-base rounded-full overflow-hidden">
                      <div
                        className="h-full bg-tier-success rounded-full"
                        style={{ width: `${(item.score / 100) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-tier-navy">{item.score}/100</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="bg-white rounded-xl border border-tier-border-default p-12 text-center">
          <div className="text-6xl mb-4">🌦️</div>
          <h3 className="text-lg font-semibold text-tier-navy mb-2">Ingen data tilgjengelig</h3>
          <p className="text-tier-text-secondary">Kunne ikke hente værdata for baner akkurat nå.</p>
        </div>
      )}
    </div>
  );
};

export default BestCoursesToday;
