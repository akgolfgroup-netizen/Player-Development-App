/**
 * StandardPageHeader
 *
 * Konsistent page header for alle sider i TIER Golf Academy.
 * Følger Design System v3.0 - Premium Light.
 *
 * Format: [Ikon] Tittel
 *         Undertekst/beskrivelse
 *
 * Eksempel:
 * <StandardPageHeader
 *   icon={BookOpen}
 *   title="Treningsdagbok"
 *   subtitle="Oversikt over dine fullførte økter"
 *   actions={<Button>Ny økt</Button>}
 * />
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StandardPageHeaderProps {
  /** Lucide icon component */
  icon?: LucideIcon;
  /** Page title */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Action buttons (right side) */
  actions?: React.ReactNode;
  /** Additional className */
  className?: string;
}

export const StandardPageHeader: React.FC<StandardPageHeaderProps> = ({
  icon: Icon,
  title,
  subtitle,
  actions,
  className = '',
}) => {
  return (
    <header className={`mb-6 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        {/* Left: Icon + Title + Subtitle */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            {Icon && (
              <div className="w-10 h-10 rounded-lg bg-ak-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon size={20} className="text-ak-primary" />
              </div>
            )}
            <h1 className="text-2xl font-bold text-ak-text-primary m-0 leading-tight">
              {title}
            </h1>
          </div>
          {subtitle && (
            <p className="text-sm text-ak-text-secondary m-0 mt-1 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right: Actions */}
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};

export default StandardPageHeader;
