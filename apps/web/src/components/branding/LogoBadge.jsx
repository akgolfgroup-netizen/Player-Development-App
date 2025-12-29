import React from 'react';
import { AKLogo } from './AKLogo';
import { tokens } from '../../design-tokens';

/**
 * LogoBadge Component
 * Reusable container for displaying the AK Golf logo in a badge/circle
 *
 * @param {number} logoSize - Size of the logo in pixels (default: 44px)
 * @param {number} badgeSize - Size of the badge container (default: 56px)
 * @param {string} backgroundColor - Background color of the badge (default: var(--accent))
 * @param {string} logoColor - Color of the logo (default: white)
 * @param {string} borderRadius - Border radius of the badge (default: 16px)
 * @param {string} className - Additional CSS classes
 * @param {string} as - HTML element type (default: 'div')
 */
export const LogoBadge = ({
  logoSize = 44,
  badgeSize = 56,
  backgroundColor = 'var(--accent)',
  logoColor = tokens.colors.white,
  borderRadius = '16px',
  className = '',
  as = 'div'
}) => {
  const Component = as;

  return (
    <Component
      className={`flex items-center justify-center flex-shrink-0 ${className}`}
      style={{
        width: `${badgeSize}px`,
        height: `${badgeSize}px`,
        backgroundColor,
        borderRadius
      }}
    >
      <AKLogo size={logoSize} color={logoColor} />
    </Component>
  );
};

export default LogoBadge;
