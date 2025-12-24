import React from 'react';
import { tokens } from '../../design-tokens';

/**
 * PageHeader Component
 * Standardized header for feature pages with title, subtitle, and actions
 */
export const PageHeader = ({
  title,
  subtitle,
  actions,
  className = ''
}) => {
  return (
    <header
      className={className}
      style={{
        backgroundColor: tokens.colors.white,
        borderBottom: `1px solid ${tokens.colors.mist}`,
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <h1 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: tokens.colors.charcoal,
            margin: 0,
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{
              fontSize: '13px',
              color: tokens.colors.steel,
              margin: '4px 0 0 0',
            }}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
