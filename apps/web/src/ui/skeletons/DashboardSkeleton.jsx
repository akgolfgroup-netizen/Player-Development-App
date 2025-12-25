import React from 'react';
import StatsCardSkeleton from './StatsCardSkeleton';
import {
  WidgetSkeleton,
  CountdownSkeleton,
  TaskListSkeleton,
  SessionsSkeleton,
} from './WidgetSkeleton';
import { SkeletonPulse } from './SkeletonBase';

/**
 * Complete dashboard loading skeleton
 * Matches the layout of AKGolfDashboard component
 */
export const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-ak-snow p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <SkeletonPulse className="h-16 w-16 rounded-full" />
          <div className="flex-1">
            <SkeletonPulse className="h-8 w-48 mb-2" />
            <SkeletonPulse className="h-4 w-32" />
          </div>
        </div>
        <SkeletonPulse className="h-6 w-64 mt-4" />
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2 spans */}
        <div className="lg:col-span-2 space-y-6">
          {/* Training Stats */}
          <StatsCardSkeleton />

          {/* Today's Sessions */}
          <SessionsSkeleton />

          {/* Countdown Widgets Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CountdownSkeleton />
            <CountdownSkeleton />
          </div>
        </div>

        {/* Right Column - 1 span */}
        <div className="space-y-6">
          {/* Tasks/Goals */}
          <TaskListSkeleton />

          {/* Messages */}
          <WidgetSkeleton items={3} withIcon />

          {/* Achievements */}
          <WidgetSkeleton items={2} withIcon />
        </div>
      </div>
    </div>
  );
};

/**
 * Compact dashboard skeleton for smaller viewports
 */
export const DashboardSkeletonCompact = () => {
  return (
    <div className="space-y-4 p-4">
      <SkeletonPulse className="h-6 w-48 mb-4" />
      <StatsCardSkeleton />
      <SessionsSkeleton />
      <WidgetSkeleton items={2} />
    </div>
  );
};

export default DashboardSkeleton;
