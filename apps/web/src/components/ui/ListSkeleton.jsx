import React from 'react';
import { tokens } from '../../design-tokens';

// Base skeleton pulse animation
const pulseKeyframes = `
  @keyframes skeletonPulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

// Base skeleton styles
const baseSkeletonStyle = {
  backgroundColor: tokens.colors.mist,
  borderRadius: tokens.radius.sm,
  animation: 'skeletonPulse 1.5s ease-in-out infinite',
};

// List Item Skeleton - Generic list item with avatar, title, subtitle
export function ListItemSkeleton({ showAvatar = true, showBadge = false }) {
  return (
    <>
      <style>{pulseKeyframes}</style>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing.md,
          padding: tokens.spacing.md,
          backgroundColor: tokens.colors.white,
          borderRadius: tokens.radius.md,
          boxShadow: tokens.shadows.card,
        }}
        aria-hidden="true"
        role="presentation"
      >
        {showAvatar && (
          <div
            style={{
              ...baseSkeletonStyle,
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              flexShrink: 0,
            }}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              ...baseSkeletonStyle,
              width: '60%',
              height: '16px',
              marginBottom: '8px',
            }}
          />
          <div
            style={{
              ...baseSkeletonStyle,
              width: '40%',
              height: '14px',
            }}
          />
        </div>
        {showBadge && (
          <div
            style={{
              ...baseSkeletonStyle,
              width: '60px',
              height: '24px',
              borderRadius: tokens.radius.sm,
            }}
          />
        )}
      </div>
    </>
  );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 4 }) {
  return (
    <>
      <style>{pulseKeyframes}</style>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: tokens.spacing.md,
          padding: tokens.spacing.md,
          borderBottom: `1px solid ${tokens.colors.mist}`,
        }}
        aria-hidden="true"
        role="presentation"
      >
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            style={{
              ...baseSkeletonStyle,
              width: i === 0 ? '80%' : '60%',
              height: '16px',
            }}
          />
        ))}
      </div>
    </>
  );
}

// Athlete List Skeleton
export function AthleteListSkeleton({ items = 5 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
      <style>{pulseKeyframes}</style>
      {Array.from({ length: items }).map((_, i) => (
        <ListItemSkeleton key={i} showAvatar showBadge />
      ))}
    </div>
  );
}

// Session List Skeleton
export function SessionListSkeleton({ items = 4 }) {
  return (
    <>
      <style>{pulseKeyframes}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
        {Array.from({ length: items }).map((_, i) => (
          <div
            key={i}
            style={{
              padding: tokens.spacing.lg,
              backgroundColor: tokens.colors.white,
              borderRadius: tokens.radius.md,
              boxShadow: tokens.shadows.card,
            }}
            aria-hidden="true"
            role="presentation"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: tokens.spacing.md }}>
              <div
                style={{
                  ...baseSkeletonStyle,
                  width: '150px',
                  height: '20px',
                }}
              />
              <div
                style={{
                  ...baseSkeletonStyle,
                  width: '80px',
                  height: '24px',
                  borderRadius: tokens.radius.sm,
                }}
              />
            </div>
            <div
              style={{
                ...baseSkeletonStyle,
                width: '100%',
                height: '14px',
                marginBottom: '8px',
              }}
            />
            <div
              style={{
                ...baseSkeletonStyle,
                width: '70%',
                height: '14px',
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}

// Stats Grid Skeleton
export function StatsGridSkeleton({ columns = 3, rows = 1 }) {
  return (
    <>
      <style>{pulseKeyframes}</style>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: tokens.spacing.md,
        }}
        aria-hidden="true"
        role="presentation"
      >
        {Array.from({ length: columns * rows }).map((_, i) => (
          <div
            key={i}
            style={{
              padding: tokens.spacing.lg,
              backgroundColor: tokens.colors.white,
              borderRadius: tokens.radius.md,
              boxShadow: tokens.shadows.card,
            }}
          >
            <div
              style={{
                ...baseSkeletonStyle,
                width: '40px',
                height: '40px',
                borderRadius: tokens.radius.sm,
                marginBottom: tokens.spacing.md,
              }}
            />
            <div
              style={{
                ...baseSkeletonStyle,
                width: '60px',
                height: '28px',
                marginBottom: tokens.spacing.sm,
              }}
            />
            <div
              style={{
                ...baseSkeletonStyle,
                width: '80px',
                height: '12px',
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}

// Calendar Skeleton
export function CalendarSkeleton() {
  return (
    <>
      <style>{pulseKeyframes}</style>
      <div
        style={{
          padding: tokens.spacing.lg,
          backgroundColor: tokens.colors.white,
          borderRadius: tokens.radius.md,
          boxShadow: tokens.shadows.card,
        }}
        aria-hidden="true"
        role="presentation"
      >
        <div
          style={{
            ...baseSkeletonStyle,
            width: '150px',
            height: '24px',
            marginBottom: tokens.spacing.lg,
          }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: tokens.spacing.sm }}>
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              style={{
                ...baseSkeletonStyle,
                width: '100%',
                aspectRatio: '1',
                borderRadius: tokens.radius.sm,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

// Message List Skeleton
export function MessageListSkeleton({ items = 6 }) {
  return (
    <>
      <style>{pulseKeyframes}</style>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {Array.from({ length: items }).map((_, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: tokens.spacing.md,
              padding: tokens.spacing.md,
              borderBottom: `1px solid ${tokens.colors.mist}`,
            }}
            aria-hidden="true"
            role="presentation"
          >
            <div
              style={{
                ...baseSkeletonStyle,
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  ...baseSkeletonStyle,
                  width: '70%',
                  height: '16px',
                  marginBottom: '8px',
                }}
              />
              <div
                style={{
                  ...baseSkeletonStyle,
                  width: '90%',
                  height: '14px',
                }}
              />
            </div>
            <div
              style={{
                ...baseSkeletonStyle,
                width: '60px',
                height: '12px',
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}

// Tournament List Skeleton
export function TournamentListSkeleton({ items = 4 }) {
  return (
    <>
      <style>{pulseKeyframes}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
        {Array.from({ length: items }).map((_, i) => (
          <div
            key={i}
            style={{
              padding: tokens.spacing.lg,
              backgroundColor: tokens.colors.white,
              borderRadius: tokens.radius.md,
              boxShadow: tokens.shadows.card,
            }}
            aria-hidden="true"
            role="presentation"
          >
            <div style={{ display: 'flex', gap: tokens.spacing.md, marginBottom: tokens.spacing.md }}>
              <div
                style={{
                  ...baseSkeletonStyle,
                  width: '60px',
                  height: '60px',
                  borderRadius: tokens.radius.sm,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    ...baseSkeletonStyle,
                    width: '60%',
                    height: '20px',
                    marginBottom: '8px',
                  }}
                />
                <div
                  style={{
                    ...baseSkeletonStyle,
                    width: '40%',
                    height: '14px',
                  }}
                />
              </div>
            </div>
            <div
              style={{
                ...baseSkeletonStyle,
                width: '100%',
                height: '12px',
                marginBottom: '6px',
              }}
            />
            <div
              style={{
                ...baseSkeletonStyle,
                width: '80%',
                height: '12px',
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}

// Form Skeleton
export function FormSkeleton({ fields = 4 }) {
  return (
    <>
      <style>{pulseKeyframes}</style>
      <div
        style={{
          padding: tokens.spacing.lg,
          backgroundColor: tokens.colors.white,
          borderRadius: tokens.radius.md,
          boxShadow: tokens.shadows.card,
        }}
        aria-hidden="true"
        role="presentation"
      >
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} style={{ marginBottom: tokens.spacing.lg }}>
            <div
              style={{
                ...baseSkeletonStyle,
                width: '120px',
                height: '14px',
                marginBottom: '8px',
              }}
            />
            <div
              style={{
                ...baseSkeletonStyle,
                width: '100%',
                height: '44px',
                borderRadius: tokens.radius.md,
              }}
            />
          </div>
        ))}
        <div
          style={{
            ...baseSkeletonStyle,
            width: '150px',
            height: '44px',
            borderRadius: tokens.radius.md,
            marginTop: tokens.spacing.lg,
          }}
        />
      </div>
    </>
  );
}

export default {
  ListItem: ListItemSkeleton,
  TableRow: TableRowSkeleton,
  AthleteList: AthleteListSkeleton,
  SessionList: SessionListSkeleton,
  StatsGrid: StatsGridSkeleton,
  Calendar: CalendarSkeleton,
  MessageList: MessageListSkeleton,
  TournamentList: TournamentListSkeleton,
  Form: FormSkeleton,
};
