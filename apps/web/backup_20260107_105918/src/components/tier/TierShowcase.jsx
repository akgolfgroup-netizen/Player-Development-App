import React, { useState } from 'react';
import {
  TierButton,
  TierCard,
  TierBadge,
  CategoryRing,
  StreakIndicator,
} from './index';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

/**
 * TIER Component Showcase
 *
 * Demo page showing all TIER components in action.
 * Useful for testing, development, and documentation.
 *
 * Access at: /tier-showcase
 */

export function TierShowcase() {
  const [progress, setProgress] = useState(65);
  const [streak, setStreak] = useState(7);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <img
            src="/assets/tier-golf/tier-golf-logo.svg"
            alt="TIER Golf"
            className="h-12 mx-auto mb-4"
          />
          <h1 className="font-display text-5xl font-bold text-tier-navy mb-2">
            TIER Component Showcase
          </h1>
          <p className="text-lg text-text-secondary">
            Design System v1.0 - All komponenter
          </p>
        </div>

        {/* Buttons Section */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl font-bold text-tier-navy">
            Buttons
          </h2>

          <div className="bg-white rounded-xl p-8 space-y-6">
            {/* Variants */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Variants</h3>
              <div className="flex flex-wrap gap-3">
                <TierButton variant="primary">Primary</TierButton>
                <TierButton variant="secondary">Secondary</TierButton>
                <TierButton variant="outline">Outline</TierButton>
                <TierButton variant="ghost">Ghost</TierButton>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <TierButton size="sm">Small</TierButton>
                <TierButton size="md">Medium</TierButton>
                <TierButton size="lg">Large</TierButton>
              </div>
            </div>

            {/* States */}
            <div>
              <h3 className="font-semibold text-lg mb-4">States</h3>
              <div className="flex flex-wrap gap-3">
                <TierButton>Normal</TierButton>
                <TierButton disabled>Disabled</TierButton>
              </div>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl font-bold text-tier-navy">
            Cards
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Base Card */}
            <TierCard>
              <h3 className="font-semibold text-lg mb-2">Base Card</h3>
              <p className="text-sm text-text-secondary">
                Standard card med border og padding
              </p>
            </TierCard>

            {/* Elevated Card */}
            <TierCard variant="elevated">
              <h3 className="font-semibold text-lg mb-2">Elevated Card</h3>
              <p className="text-sm text-text-secondary">
                Card med shadow effekt
              </p>
            </TierCard>

            {/* Hoverable Card */}
            <TierCard hoverable>
              <h3 className="font-semibold text-lg mb-2">Hoverable Card</h3>
              <p className="text-sm text-text-secondary">
                Hover over meg!
              </p>
            </TierCard>
          </div>

          {/* Category Cards */}
          <div>
            <h3 className="font-semibold text-xl mb-4">Category Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['A', 'D', 'F', 'H', 'J'].map((cat) => (
                <TierCard key={cat} variant="category" category={cat}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-category-${cat.toLowerCase()} flex items-center justify-center text-white font-bold`}>
                      {cat}
                    </div>
                    <div>
                      <h4 className="font-semibold">Kategori {cat}</h4>
                      <p className="text-xs text-text-muted">
                        {CategoryRing.categoryNames[cat]}
                      </p>
                    </div>
                  </div>
                </TierCard>
              ))}
            </div>
          </div>

          {/* Tier Cards */}
          <div>
            <h3 className="font-semibold text-xl mb-4">Tier Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['bronze', 'silver', 'gold', 'platinum'].map((tier) => (
                <TierCard key={tier} variant="tier" tier={tier}>
                  <div className="text-center py-4">
                    <div className={`w-16 h-16 mx-auto mb-2 rounded-full bg-badge-tier-${tier} flex items-center justify-center`}>
                      <span className="text-2xl">🏆</span>
                    </div>
                    <h4 className="font-semibold capitalize">{tier}</h4>
                  </div>
                </TierCard>
              ))}
            </div>
          </div>
        </section>

        {/* Badges Section */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl font-bold text-tier-navy">
            Badges
          </h2>

          <div className="bg-white rounded-xl p-8 space-y-6">
            {/* Variants */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Variants</h3>
              <div className="flex flex-wrap gap-3">
                <TierBadge variant="primary">Primary</TierBadge>
                <TierBadge variant="gold">Gold</TierBadge>
                <TierBadge variant="success" icon={<CheckCircle />}>
                  Success
                </TierBadge>
                <TierBadge variant="warning" icon={<AlertTriangle />}>
                  Warning
                </TierBadge>
                <TierBadge variant="error" icon={<XCircle />}>
                  Error
                </TierBadge>
                <TierBadge variant="info" icon={<Info />}>
                  Info
                </TierBadge>
                <TierBadge variant="neutral">Neutral</TierBadge>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <TierBadge size="sm">Small</TierBadge>
                <TierBadge size="md">Medium</TierBadge>
                <TierBadge size="lg">Large</TierBadge>
              </div>
            </div>
          </div>
        </section>

        {/* Gamification Section */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl font-bold text-tier-navy">
            Gamification
          </h2>

          {/* Category Rings */}
          <div className="bg-white rounded-xl p-8">
            <h3 className="font-semibold text-xl mb-6">Category Rings</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Progress: {progress}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full max-w-md"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {['A', 'C', 'D', 'F', 'H', 'J'].map((cat) => (
                <div key={cat} className="flex flex-col items-center">
                  <CategoryRing
                    category={cat}
                    progress={progress}
                    size={100}
                  />
                  <p className="text-xs text-text-muted mt-2 text-center">
                    {CategoryRing.categoryNames[cat]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Streak Indicator */}
          <div className="bg-white rounded-xl p-8">
            <h3 className="font-semibold text-xl mb-6">Streak Indicator</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Streak: {streak} dager
              </label>
              <input
                type="range"
                min="0"
                max="30"
                value={streak}
                onChange={(e) => setStreak(Number(e.target.value))}
                className="w-full max-w-md"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <StreakIndicator count={streak} size="sm" />
              <StreakIndicator count={streak} size="md" />
              <StreakIndicator count={streak} size="lg" />
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl font-bold text-tier-navy">
            Color Palette
          </h2>

          <div className="bg-white rounded-xl p-8 space-y-6">
            {/* Primary Colors */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Primary Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ColorSwatch color="bg-tier-navy" name="Navy" hex="#0A2540" />
                <ColorSwatch color="bg-tier-gold" name="Gold" hex="#C9A227" />
                <ColorSwatch color="bg-tier-white border border-gray-200" name="White" hex="#FFFFFF" />
              </div>
            </div>

            {/* Category Colors */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Category A-K</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-3">
                {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'].map((cat) => (
                  <ColorSwatch
                    key={cat}
                    color={`bg-category-${cat}`}
                    name={cat.toUpperCase()}
                  />
                ))}
              </div>
            </div>

            {/* Status Colors */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Status Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ColorSwatch color="bg-status-success" name="Success" hex="#16A34A" />
                <ColorSwatch color="bg-status-warning" name="Warning" hex="#D97706" />
                <ColorSwatch color="bg-status-error" name="Error" hex="#DC2626" />
                <ColorSwatch color="bg-status-info" name="Info" hex="#2563EB" />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-sm text-text-muted pb-8">
          <p>TIER Golf Design System v1.0</p>
          <p className="mt-1">Built with React + Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}

// Helper component for color swatches
function ColorSwatch({ color, name, hex }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-16 h-16 rounded-lg ${color} shadow-sm`} />
      <div className="text-center">
        <p className="text-xs font-semibold">{name}</p>
        {hex && <p className="text-xs text-text-muted">{hex}</p>}
      </div>
    </div>
  );
}

export default TierShowcase;
