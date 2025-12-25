import React from 'react';
import { SkeletonPulse, SkeletonCard, SkeletonCircle } from './SkeletonBase';

/**
 * Generic widget skeleton with title and content
 */
export const WidgetSkeleton = ({ items = 3, withIcon = false }) => (
  <SkeletonCard>
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <SkeletonPulse className="h-5 w-28" />
      <SkeletonPulse className="h-4 w-16" />
    </div>

    {/* Content list */}
    <div className="space-y-2">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-ak-snow rounded-lg">
          {withIcon && <SkeletonCircle size={20} />}
          <div className="flex-1">
            <SkeletonPulse className="h-4 w-3/4 mb-1" />
            <SkeletonPulse className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  </SkeletonCard>
);

/**
 * Skeleton for countdown widgets (tournament/test)
 */
export const CountdownSkeleton = () => (
  <SkeletonCard>
    <div className="flex items-start gap-3">
      {/* Icon */}
      <SkeletonPulse className="h-10 w-10 rounded-lg flex-shrink-0" />

      {/* Content */}
      <div className="flex-1">
        <SkeletonPulse className="h-3 w-20 mb-2" />
        <SkeletonPulse className="h-4 w-32 mb-1" />
        <SkeletonPulse className="h-3 w-24" />
      </div>

      {/* Countdown */}
      <div className="text-right">
        <SkeletonPulse className="h-8 w-10 mb-1" />
        <SkeletonPulse className="h-3 w-8" />
      </div>
    </div>
  </SkeletonCard>
);

/**
 * Skeleton for task/goal list
 */
export const TaskListSkeleton = () => (
  <SkeletonCard>
    <SkeletonPulse className="h-5 w-28 mb-4" />

    <div className="space-y-2">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-center gap-3 p-3 bg-ak-snow rounded-lg">
          <SkeletonCircle size={20} />
          <div className="flex-1">
            <SkeletonPulse className="h-4 w-3/4 mb-1" />
            <SkeletonPulse className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  </SkeletonCard>
);

/**
 * Skeleton for calendar/sessions widget
 */
export const SessionsSkeleton = () => (
  <SkeletonCard>
    <SkeletonPulse className="h-5 w-32 mb-4" />

    <div className="space-y-3">
      {[1, 2].map(i => (
        <div key={i} className="p-4 bg-ak-snow rounded-xl">
          <div className="flex items-start gap-3 mb-2">
            <SkeletonPulse className="h-10 w-10 rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <SkeletonPulse className="h-4 w-32 mb-1" />
              <SkeletonPulse className="h-3 w-20" />
            </div>
            <SkeletonPulse className="h-6 w-16 rounded" />
          </div>
          <div className="flex gap-2 mt-2">
            <SkeletonPulse className="h-5 w-16 rounded" />
            <SkeletonPulse className="h-5 w-12 rounded" />
          </div>
        </div>
      ))}
    </div>
  </SkeletonCard>
);

export default WidgetSkeleton;
