import React from 'react';
import { SkeletonPulse, SkeletonCard } from './SkeletonBase';

/**
 * Skeleton for training stats widget
 */
export const StatsCardSkeleton = () => (
  <SkeletonCard>
    {/* Title */}
    <SkeletonPulse className="h-5 w-32 mb-4" />

    {/* Stats grid */}
    <div className="grid grid-cols-3 gap-4 mb-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="text-center p-3 bg-ak-snow rounded-xl">
          <SkeletonPulse className="h-8 w-12 mx-auto mb-2" />
          <SkeletonPulse className="h-3 w-16 mx-auto" />
        </div>
      ))}
    </div>

    {/* Progress bars */}
    <div className="space-y-3">
      <div>
        <div className="flex justify-between mb-1">
          <SkeletonPulse className="h-3 w-20" />
          <SkeletonPulse className="h-3 w-12" />
        </div>
        <SkeletonPulse className="h-2 w-full rounded-full" />
      </div>
      <div>
        <div className="flex justify-between mb-1">
          <SkeletonPulse className="h-3 w-24" />
          <SkeletonPulse className="h-3 w-12" />
        </div>
        <SkeletonPulse className="h-2 w-full rounded-full" />
      </div>
    </div>
  </SkeletonCard>
);

export default StatsCardSkeleton;
