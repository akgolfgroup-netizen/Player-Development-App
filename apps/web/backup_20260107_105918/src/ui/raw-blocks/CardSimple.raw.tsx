import React from 'react';

/**
 * CardSimple Raw Block
 * Basic card container component with consistent styling
 */

interface CardSimpleProps {
  /** Card content */
  children: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Enable hover effects */
  hoverable?: boolean;
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Shadow depth */
  shadow?: 'none' | 'card' | 'elevated';
  /** Border radius */
  rounded?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
  /** Additional styles */
  style?: React.CSSProperties;
}

const CardSimple: React.FC<CardSimpleProps> = ({
  children,
  onClick,
  hoverable = false,
  padding = 'md',
  shadow = 'card',
  rounded = 'md',
  className = '',
  style = {},
}) => {
  const getPadding = () => {
    switch (padding) {
      case 'none':
        return '0';
      case 'sm':
        return 'var(--spacing-2)';
      case 'lg':
        return 'var(--spacing-6)';
      default:
        return 'var(--spacing-4)';
    }
  };

  const getShadow = () => {
    switch (shadow) {
      case 'none':
        return 'none';
      case 'elevated':
        return 'var(--shadow-elevated)';
      default:
        return 'var(--shadow-card)';
    }
  };

  const getBorderRadius = () => {
    switch (rounded) {
      case 'sm':
        return 'var(--radius-sm)';
      case 'lg':
        return 'var(--radius-lg)';
      default:
        return 'var(--radius-md)';
    }
  };

  const cardStyle: React.CSSProperties = {
    ...styles.card,
    padding: getPadding(),
    boxShadow: getShadow(),
    borderRadius: getBorderRadius(),
    ...(onClick && styles.clickable),
    ...(hoverable && styles.hoverable),
    ...style,
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      style={cardStyle}
      onClick={onClick}
      className={className}
      type={onClick ? 'button' : undefined}
    >
      {children}
    </Component>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: 'var(--background-white)',
    border: 'none',
    display: 'block',
    width: '100%',
    textAlign: 'left',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  },
  clickable: {
    cursor: 'pointer',
  },
  hoverable: {
    // Hover styles will be applied via :hover in CSS
  },
};

export default CardSimple;
