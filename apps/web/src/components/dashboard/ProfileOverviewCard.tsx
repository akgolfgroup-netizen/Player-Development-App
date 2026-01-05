/**
 * ProfileOverviewCard
 *
 * Profile overview card for dashboard pages.
 * Based on Tailwind UI with AK Golf design system.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface ProfileStat {
  label: string;
  value: string | number;
}

interface ProfileOverviewCardProps {
  /** User's display name */
  name: string;
  /** User's role or subtitle */
  role: string;
  /** User's email (optional) */
  email?: string;
  /** Avatar image URL (optional, uses initials if not provided) */
  avatarUrl?: string;
  /** Stats to display in the footer (max 3-4 recommended) */
  stats?: ProfileStat[];
  /** Link to profile page */
  profileHref?: string;
  /** Custom welcome message (defaults to time-based greeting) */
  welcomeMessage?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'God morgen';
  if (hour < 18) return 'God ettermiddag';
  return 'God kveld';
}

export function ProfileOverviewCard({
  name,
  role,
  email,
  avatarUrl,
  stats = [],
  profileHref = '/mer/profil',
  welcomeMessage,
}: ProfileOverviewCardProps) {
  const initials = getInitials(name);
  const greeting = welcomeMessage ?? getGreeting();

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-900 dark:shadow-none dark:ring-1 dark:ring-white/10">
      <div className="bg-white p-6 dark:bg-gray-800/75">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:space-x-5">
            {/* Avatar */}
            <div className="shrink-0">
              {avatarUrl ? (
                <img
                  alt={name}
                  src={avatarUrl}
                  className="mx-auto size-20 rounded-full object-cover dark:ring-1 dark:ring-white/10"
                />
              ) : (
                <div className="mx-auto size-20 rounded-full bg-ak-primary flex items-center justify-center dark:ring-1 dark:ring-white/10">
                  <span className="text-2xl font-bold text-white">{initials}</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {greeting},
              </p>
              <p className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
                {name}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {role}
              </p>
            </div>
          </div>

          {/* View Profile Button */}
          <div className="mt-5 flex justify-center sm:mt-0">
            <Link
              to={profileHref}
              className="flex items-center justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:shadow-none dark:ring-white/10 dark:hover:bg-white/20 transition-colors"
            >
              Se profil
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Footer */}
      {stats.length > 0 && (
        <div
          className={clsx(
            'grid divide-y divide-gray-200 border-t border-gray-200 bg-gray-50 dark:divide-white/10 dark:border-white/10 dark:bg-gray-800/50',
            stats.length === 1 && 'grid-cols-1',
            stats.length === 2 && 'grid-cols-2 sm:divide-x sm:divide-y-0',
            stats.length === 3 && 'grid-cols-1 sm:grid-cols-3 sm:divide-x sm:divide-y-0',
            stats.length >= 4 && 'grid-cols-2 sm:grid-cols-4 sm:divide-x sm:divide-y-0'
          )}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="px-6 py-5 text-center text-sm font-medium">
              <span className="text-gray-900 dark:text-white">{stat.value}</span>{' '}
              <span className="text-gray-600 dark:text-gray-400">{stat.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProfileOverviewCard;
