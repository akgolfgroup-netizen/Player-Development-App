import React from 'react';

/**
 * Base skeleton component with shimmer animation
 */
export const SkeletonPulse = ({ className = '', width, height, rounded = false }) => {
  const style = {
    width: width || '100%',
    height: height || '1rem',
    ...(rounded && { borderRadius: '9999px' }),
  };

  return (
    <div
      className={`animate-pulse bg-ak-mist ${rounded ? 'rounded-full' : 'rounded'} ${className}`}
      style={style}
    />
  );
};

/**
 * Card wrapper for skeleton content
 */
export const SkeletonCard = ({ children, className = '' }) => (
  <div
    className={`bg-white rounded-xl border border-ak-mist p-5 ${className}`}
    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
  >
    {children}
  </div>
);

/**
 * Text skeleton line
 */
export const SkeletonText = ({ lines = 1, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonPulse
        key={i}
        height="0.875rem"
        className={i === lines - 1 ? 'w-3/4' : 'w-full'}
      />
    ))}
  </div>
);

/**
 * Circle skeleton (for avatars, icons)
 */
export const SkeletonCircle = ({ size = 40, className = '' }) => (
  <SkeletonPulse
    width={`${size}px`}
    height={`${size}px`}
    rounded
    className={className}
  />
);

export default SkeletonPulse;
