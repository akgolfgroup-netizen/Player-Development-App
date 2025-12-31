import React from 'react';
import { tokens } from '../../design-tokens';
import { PageTitle } from '../typography';

/**
 * PageHeader Component
 * Standardized header for feature pages with title, subtitle, and actions
 *
 * REGEL: Denne komponenten renderer sidens <h1> via PageTitle.
 * Bruk ikke <h1> andre steder på siden.
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
        maxWidth: '1536px',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <PageTitle
          subtitle={subtitle}
          style={{
            // Override default PageTitle styles for header context
          }}
        >
          {title}
        </PageTitle>
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
