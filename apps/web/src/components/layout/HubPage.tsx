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
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number }>>;
  return icons[iconName] || LucideIcons.Circle;
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
      {/* Hero Header Section */}
      <header
        style={{
          background: `linear-gradient(135deg, ${colors.surface} 0%, #FFFFFF 100%)`,
          borderRadius: 20,
          padding: '32px 32px 24px',
          marginBottom: 32,
          border: `1px solid ${colors.primary}15`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Title Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <span
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}CC 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: `0 8px 20px ${colors.primary}30`,
            }}
          >
            <AreaIcon size={28} />
          </span>
          <div>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: '#111827',
                margin: 0,
                letterSpacing: '-0.5px',
              }}
            >
              {title || area.label}
            </h1>
            {subtitle && (
              <p style={{ fontSize: 16, color: '#6B7280', margin: '6px 0 0' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Quick Stats Row - Inside Hero */}
        {quickStats && quickStats.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 16,
            }}
          >
            {quickStats.map((stat, index) => {
              const StatIcon = stat.icon ? getIcon(stat.icon) : null;
              const statColor = stat.color || colors.primary;
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 14,
                    padding: '18px 20px',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                  }}
                >
                  {StatIcon && (
                    <span
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        backgroundColor: `${statColor}12`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: statColor,
                        flexShrink: 0,
                      }}
                    >
                      <StatIcon size={22} />
                    </span>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 26,
                        fontWeight: 700,
                        color: statColor,
                        lineHeight: 1.1,
                        letterSpacing: '-0.5px',
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: '#6B7280',
                        marginTop: 2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Featured Action - Inside Hero */}
        {featuredAction && (
          <Link
            to={featuredAction.href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 28px',
              borderRadius: 12,
              backgroundColor: featuredAction.variant === 'secondary' ? '#FFFFFF' : colors.primary,
              color: featuredAction.variant === 'secondary' ? colors.primary : '#FFFFFF',
              border: featuredAction.variant === 'secondary' ? `2px solid ${colors.primary}` : 'none',
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
              marginTop: 24,
              transition: 'all 0.2s',
              boxShadow: featuredAction.variant === 'secondary' ? 'none' : `0 4px 14px ${colors.primary}40`,
            }}
          >
            {featuredAction.icon && React.createElement(getIcon(featuredAction.icon), { size: 18 })}
            {featuredAction.label}
          </Link>
        )}
      </header>

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

type ColorScheme = (typeof navigationColors)[keyof typeof navigationColors];

interface SectionCardProps {
  section: NavSection;
  colors: ColorScheme;
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
