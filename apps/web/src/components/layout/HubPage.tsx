/**
 * ============================================================
 * HubPage - Reusable Hub Page Layout
 * AK Golf Academy Design System v3.0
 * ============================================================
 *
 * Generisk hub-side som viser seksjoner med lenker.
 * Brukes som landing page for hvert hovedområde.
 *
 * ============================================================
 */

import React from 'react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import type { NavArea, NavSection } from '../../config/player-navigation-v3';
import { navigationColors } from '../../config/navigation-tokens';

const { ChevronRight } = LucideIcons;

const getIcon = (iconName: string): React.ComponentType<{ size?: number }> => {
  return (LucideIcons as Record<string, React.ComponentType<{ size?: number }>>)[iconName] || LucideIcons.Circle;
};

interface HubPageProps {
  area: NavArea;
  title?: string;
  subtitle?: string;
  quickStats?: Array<{
    label: string;
    value: string | number;
    icon?: string;
    color?: string;
  }>;
  featuredAction?: {
    label: string;
    href: string;
    icon?: string;
    variant?: 'primary' | 'secondary';
  };
}

export default function HubPage({
  area,
  title,
  subtitle,
  quickStats,
  featuredAction,
}: HubPageProps) {
  const colors = navigationColors[area.id as keyof typeof navigationColors] || navigationColors.dashboard;
  const AreaIcon = getIcon(area.icon);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <header style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
          <span
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: colors.surface,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.primary,
            }}
          >
            <AreaIcon size={24} />
          </span>
          <div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: '#111827',
                margin: 0,
              }}
            >
              {title || area.label}
            </h1>
            {subtitle && (
              <p style={{ fontSize: 15, color: '#6B7280', margin: '4px 0 0' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      {quickStats && quickStats.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 16,
            marginBottom: 32,
          }}
        >
          {quickStats.map((stat, index) => {
            const StatIcon = stat.icon ? getIcon(stat.icon) : null;
            return (
              <div
                key={index}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 12,
                  padding: 16,
                  border: '1px solid #E5E7EB',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  {StatIcon && (
                    <StatIcon size={16} />
                  )}
                  <span style={{ fontSize: 13, color: '#6B7280' }}>{stat.label}</span>
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: stat.color || colors.primary,
                  }}
                >
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Featured Action */}
      {featuredAction && (
        <Link
          to={featuredAction.href}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            borderRadius: 10,
            backgroundColor: featuredAction.variant === 'secondary' ? '#FFFFFF' : colors.primary,
            color: featuredAction.variant === 'secondary' ? colors.primary : '#FFFFFF',
            border: featuredAction.variant === 'secondary' ? `2px solid ${colors.primary}` : 'none',
            fontSize: 15,
            fontWeight: 600,
            textDecoration: 'none',
            marginBottom: 32,
            transition: 'all 0.2s',
          }}
        >
          {featuredAction.icon && React.createElement(getIcon(featuredAction.icon), { size: 18 })}
          {featuredAction.label}
        </Link>
      )}

      {/* Sections Grid */}
      {area.sections && area.sections.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {area.sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              colors={colors}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface SectionCardProps {
  section: NavSection;
  colors: typeof navigationColors.dashboard;
}

function SectionCard({ section, colors }: SectionCardProps) {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
      }}
    >
      {/* Section Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #E5E7EB',
          backgroundColor: colors.surface,
        }}
      >
        <h2
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: colors.text,
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {section.label}
        </h2>
      </div>

      {/* Section Items */}
      <div style={{ padding: 8 }}>
        {section.items.map((item) => {
          const ItemIcon = item.icon ? getIcon(item.icon) : null;
          return (
            <Link
              key={item.href}
              to={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 10,
                textDecoration: 'none',
                color: '#111827',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.surface;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {ItemIcon && (
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    backgroundColor: `${colors.primary}15`,
                    color: colors.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ItemIcon size={18} />
                </span>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{item.label}</div>
                {item.description && (
                  <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
                    {item.description}
                  </div>
                )}
              </div>
              <ChevronRight size={16} style={{ color: '#9CA3AF' }} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
