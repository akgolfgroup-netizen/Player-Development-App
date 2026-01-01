// React Component Examples - Premium Golf Coaching App
// Using React + TypeScript + Tailwind CSS

import React from 'react';

// =============================================================================
// BUTTON COMPONENTS
// =============================================================================

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gold' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 inline-flex items-center justify-center';

  const variants = {
    primary: 'bg-primary-700 text-white hover:bg-primary-600 active:bg-primary-800',
    secondary: 'bg-transparent text-primary-700 border border-primary-700 hover:bg-primary-700/10',
    gold: 'bg-gold-gradient text-surface-black shadow-gold-glow hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:-translate-y-0.5',
    ghost: 'bg-transparent text-text-secondary hover:text-white hover:underline',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

// =============================================================================
// CARD COMPONENTS
// =============================================================================

interface CardProps {
  children: React.ReactNode;
  elevated?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevated = false,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        ${elevated ? 'bg-surface-elevated shadow-elevated' : 'bg-surface-card shadow-card'}
        border border-surface-border rounded-xl p-5
        ${onClick ? 'cursor-pointer hover:border-primary-600 transition-colors duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  value: string | number;
  label: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  trend,
  icon,
}) => {
  return (
    <Card className="text-center hover:border-primary-600 transition-all duration-200">
      {icon && <div className="text-2xl mb-2">{icon}</div>}
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-text-secondary mb-2">{label}</div>
      {trend && (
        <div className={`text-sm font-medium ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
          {trend.positive ? '↓' : '↑'} {trend.value}
        </div>
      )}
    </Card>
  );
};

// =============================================================================
// VIDEO THUMBNAIL COMPONENT
// =============================================================================

interface VideoThumbnailProps {
  title: string;
  instructor: string;
  duration: string;
  rating: number;
  views: string;
  thumbnailUrl: string;
  progress?: number;
  onClick?: () => void;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  title,
  instructor,
  duration,
  rating,
  views,
  thumbnailUrl,
  progress,
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      className="overflow-hidden p-0 hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-surface-dark">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
            <span className="text-2xl">▶</span>
          </div>
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs font-medium">
          {duration}
        </div>
        {/* Progress bar */}
        {progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-border">
            <div
              className="h-full bg-primary-600"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white mb-1 line-clamp-2">{title}</h3>
        <p className="text-sm text-text-secondary mb-2">{instructor}</p>
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <span className="text-gold-400">{'★'.repeat(Math.floor(rating))}</span>
          <span>•</span>
          <span>{views} views</span>
        </div>
      </div>
    </Card>
  );
};

// =============================================================================
// PROGRESS BAR COMPONENT
// =============================================================================

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
  variant = 'default',
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variants = {
    default: 'bg-gradient-to-r from-primary-700 to-primary-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-text-secondary">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-medium text-white">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-surface-border rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${sizes[size]} ${variants[variant]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// =============================================================================
// INPUT COMPONENT
// =============================================================================

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'search';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  error?: string;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  icon,
  error,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full bg-surface-dark border rounded-lg px-4 py-3 text-white
            placeholder:text-text-muted
            focus:outline-none focus:border-primary-600 focus:ring-[3px] focus:ring-primary-600/20
            transition-all duration-200
            ${icon ? 'pl-12' : ''}
            ${error ? 'border-red-500' : 'border-surface-border'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

// =============================================================================
// BADGE COMPONENTS
// =============================================================================

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'premium' | 'success' | 'warning' | 'error';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
}) => {
  const variants = {
    default: 'bg-primary-600/20 text-primary-400 border border-primary-600/40',
    premium: 'bg-gold-gradient text-surface-black',
    success: 'bg-green-500/20 text-green-400 border border-green-500/40',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40',
    error: 'bg-red-500/20 text-red-400 border border-red-500/40',
  };

  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
      ${variants[variant]}
    `}>
      {children}
    </span>
  );
};

// =============================================================================
// NAVIGATION COMPONENTS
// =============================================================================

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

interface BottomNavProps {
  items: NavItem[];
  onNavigate: (href: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  items,
  onNavigate,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface-dark border-t border-surface-border safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => (
          <button
            key={item.href}
            onClick={() => onNavigate(item.href)}
            className={`
              flex flex-col items-center justify-center gap-1 px-4 py-2
              transition-colors duration-200
              ${item.active ? 'text-primary-500' : 'text-text-muted hover:text-white'}
            `}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
            {item.active && (
              <span className="w-1 h-1 rounded-full bg-primary-500 mt-1" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

// =============================================================================
// SIDEBAR NAVIGATION (WEB)
// =============================================================================

interface SidebarProps {
  items: NavItem[];
  activeHref: string;
  onNavigate: (href: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeHref,
  onNavigate,
}) => {
  return (
    <aside className="w-60 h-screen bg-surface-dark border-r border-surface-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⛳</span>
          <span className="text-xl font-bold text-white">ProSwing</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.href}>
              <button
                onClick={() => onNavigate(item.href)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${activeHref === item.href
                    ? 'bg-primary-700/20 text-primary-400'
                    : 'text-text-secondary hover:bg-surface-elevated hover:text-white'
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-surface-border">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-text-secondary hover:text-white transition-colors">
          <span>⚙️</span>
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

// =============================================================================
// STROKES GAINED BAR
// =============================================================================

interface StrokesGainedProps {
  category: string;
  value: number;
  maxValue?: number;
}

export const StrokesGainedBar: React.FC<StrokesGainedProps> = ({
  category,
  value,
  maxValue = 2,
}) => {
  const percentage = Math.abs(value) / maxValue * 50;
  const isPositive = value >= 0;

  return (
    <div className="flex items-center gap-4">
      <span className="w-24 text-sm text-text-secondary">{category}</span>
      <div className="flex-1 h-6 bg-surface-border rounded relative">
        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-surface-card" />
        {/* Bar */}
        <div
          className={`
            absolute top-1 bottom-1 rounded
            ${isPositive ? 'bg-green-500' : 'bg-red-500'}
          `}
          style={{
            left: isPositive ? '50%' : `${50 - percentage}%`,
            width: `${percentage}%`,
          }}
        />
      </div>
      <span className={`w-12 text-sm font-medium text-right ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? '+' : ''}{value.toFixed(1)}
      </span>
    </div>
  );
};

// =============================================================================
// COACH CARD
// =============================================================================

interface CoachCardProps {
  name: string;
  title: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  isSelected?: boolean;
  onSelect: () => void;
}

export const CoachCard: React.FC<CoachCardProps> = ({
  name,
  title,
  rating,
  reviews,
  imageUrl,
  isSelected = false,
  onSelect,
}) => {
  return (
    <Card
      onClick={onSelect}
      className={`
        text-center cursor-pointer transition-all duration-200
        ${isSelected ? 'border-primary-600 ring-2 ring-primary-600/20' : 'hover:border-surface-elevated'}
      `}
    >
      <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-surface-elevated">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      </div>
      <h3 className="font-semibold text-white mb-1">{name}</h3>
      <p className="text-sm text-text-secondary mb-2">{title}</p>
      <div className="flex items-center justify-center gap-1 text-sm">
        <span className="text-gold-400">★★★★★</span>
        <span className="text-text-muted">({reviews})</span>
      </div>
      {isSelected && (
        <div className="mt-3 text-primary-400 text-sm font-medium">
          ✓ Selected
        </div>
      )}
    </Card>
  );
};

// =============================================================================
// TOAST NOTIFICATION
// =============================================================================

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onClose,
}) => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  const colors = {
    success: 'border-l-green-500',
    error: 'border-l-red-500',
    warning: 'border-l-yellow-500',
    info: 'border-l-blue-500',
  };

  return (
    <div className={`
      fixed top-4 right-4 z-50
      bg-surface-elevated border border-surface-border border-l-4 ${colors[type]}
      rounded-lg shadow-elevated p-4
      flex items-center gap-3
      animate-slide-down
    `}>
      <span className="text-lg">{icons[type]}</span>
      <span className="text-white">{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-text-muted hover:text-white ml-2">
          ✕
        </button>
      )}
    </div>
  );
};

// =============================================================================
// SKELETON LOADER
// =============================================================================

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`
        bg-surface-elevated rounded animate-pulse
        bg-gradient-to-r from-surface-elevated via-surface-card to-surface-elevated
        bg-[length:200%_100%] animate-shimmer
        ${className}
      `}
    />
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <Card>
      <Skeleton className="h-6 w-1/3 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <Skeleton className="h-10 w-24" />
    </Card>
  );
};

// =============================================================================
// EMPTY STATE
// =============================================================================

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="text-center py-12 px-4">
      <div className="text-5xl mb-4 text-text-muted">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-text-secondary mb-6 max-w-sm mx-auto">{description}</p>
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};
