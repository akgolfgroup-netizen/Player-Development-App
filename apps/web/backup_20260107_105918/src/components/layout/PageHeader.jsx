/**
 * PageHeader Component
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Minimal inline styles (dynamic colors)
 *
 * REGEL: Denne komponenten renderer sidens <h1> via PageTitle.
 * Bruk ikke <h1> andre steder på siden.
 */

import React from 'react';
import { PageTitle } from '../typography';

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
        backgroundColor: 'var(--tier-surface-card)',
        borderBottom: '1px solid var(--tier-border-default)',
        borderRadius: 'var(--radius-lg)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        marginBottom: '8px',
      }}
    >
      <div style={{
        width: '100%',
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
