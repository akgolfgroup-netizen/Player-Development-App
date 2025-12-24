import React from 'react';

/**
 * Avatar Primitive
 * User avatar with image, initials, or icon fallback
 */

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  /** Image source URL */
  src?: string;
  /** Alt text for image */
  alt?: string;
  /** Name to generate initials */
  name?: string;
  /** Size variant */
  size?: AvatarSize;
  /** Status indicator */
  status?: 'online' | 'offline' | 'away' | 'busy';
  /** Custom background color */
  bgColor?: string;
  /** Fallback icon */
  icon?: React.ReactNode;
  /** Additional className */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  status,
  bgColor,
  icon,
  className = '',
  onClick,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'var(--ak-success)';
      case 'away':
        return 'var(--ak-warning)';
      case 'busy':
        return 'var(--ak-error)';
      default:
        return 'var(--gray-500)';
    }
  };

  const avatarStyle: React.CSSProperties = {
    ...styles.base,
    ...styles.sizes[size],
    ...(bgColor && { backgroundColor: bgColor }),
    ...(onClick && styles.clickable),
  };

  const hasImage = src && !imageError;
  const initials = name ? getInitials(name) : '';

  return (
    <div
      style={avatarStyle}
      className={className}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {hasImage ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          style={styles.image}
          onError={() => setImageError(true)}
        />
      ) : initials ? (
        <span style={styles.initials}>{initials}</span>
      ) : icon ? (
        <span style={styles.icon}>{icon}</span>
      ) : (
        <span style={styles.fallbackIcon}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </span>
      )}

      {status && (
        <span
          style={{
            ...styles.statusIndicator,
            backgroundColor: getStatusColor(),
          }}
          aria-label={status}
        />
      )}
    </div>
  );
};

const sizes = {
  xs: { size: '24px', fontSize: '10px' },
  sm: { size: '32px', fontSize: '12px' },
  md: { size: '40px', fontSize: '14px' },
  lg: { size: '56px', fontSize: '20px' },
  xl: { size: '80px', fontSize: '28px' },
};

const styles: Record<string, React.CSSProperties | Record<string, React.CSSProperties>> = {
  base: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: 'var(--ak-primary)',
    color: 'var(--text-inverse)',
    fontWeight: 600,
    flexShrink: 0,
    overflow: 'hidden',
  } as React.CSSProperties,
  sizes: {
    xs: { width: sizes.xs.size, height: sizes.xs.size, fontSize: sizes.xs.fontSize },
    sm: { width: sizes.sm.size, height: sizes.sm.size, fontSize: sizes.sm.fontSize },
    md: { width: sizes.md.size, height: sizes.md.size, fontSize: sizes.md.fontSize },
    lg: { width: sizes.lg.size, height: sizes.lg.size, fontSize: sizes.lg.fontSize },
    xl: { width: sizes.xl.size, height: sizes.xl.size, fontSize: sizes.xl.fontSize },
  },
  clickable: {
    cursor: 'pointer',
    transition: 'transform 0.15s ease',
  } as React.CSSProperties,
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  } as React.CSSProperties,
  initials: {
    fontFamily: 'var(--font-family)',
    textTransform: 'uppercase',
  } as React.CSSProperties,
  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,
  fallbackIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'currentColor',
  } as React.CSSProperties,
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '25%',
    height: '25%',
    borderRadius: '50%',
    border: '2px solid var(--background-white)',
  } as React.CSSProperties,
};

export default Avatar;
