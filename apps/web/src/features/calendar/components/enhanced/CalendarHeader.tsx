/**
 * CalendarHeader.tsx
 *
 * Enhanced calendar header with view switcher dropdown.
 * Based on Tailwind UI calendar templates.
 *
 * Features:
 * - Month/year display
 * - Previous/Next navigation
 * - Today button
 * - View switcher dropdown (Day, Week, Month, Year)
 * - Add event button
 * - Mobile menu
 */

import React, { Fragment } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { ChevronLeft, ChevronRight, ChevronDown, MoreHorizontal, Plus } from 'lucide-react';
import clsx from 'clsx';

export type CalendarView = 'day' | 'week' | 'month' | 'year';

interface CalendarHeaderProps {
  /** Current view mode */
  view: CalendarView;
  /** Title to display (e.g., "Januar 2025" or "Uke 3, 2025") */
  title: string;
  /** Subtitle (optional, e.g., "Lørdag" for day view) */
  subtitle?: string;
  /** Navigate to previous period */
  onPrev: () => void;
  /** Navigate to next period */
  onNext: () => void;
  /** Navigate to today */
  onToday: () => void;
  /** Change view mode */
  onViewChange: (view: CalendarView) => void;
  /** Add new event */
  onAddEvent?: () => void;
  /** Button label (default: "Legg til") */
  addEventLabel?: string;
}

const VIEW_OPTIONS: { value: CalendarView; label: string }[] = [
  { value: 'day', label: 'Dag' },
  { value: 'week', label: 'Uke' },
  { value: 'month', label: 'Måned' },
  { value: 'year', label: 'År' },
];

const VIEW_LABELS: Record<CalendarView, string> = {
  day: 'Dag',
  week: 'Uke',
  month: 'Måned',
  year: 'År',
};

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  view,
  title,
  subtitle,
  onPrev,
  onNext,
  onToday,
  onViewChange,
  onAddEvent,
  addEventLabel = 'Legg til',
}) => {
  return (
    <header className="flex flex-none items-center justify-between border-b border-ak-border-default px-6 py-4 bg-ak-surface-base">
      {/* Left: Title */}
      <div>
        <h1 className="text-base font-semibold text-ak-text-primary">
          <time>{title}</time>
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-ak-text-tertiary">{subtitle}</p>
        )}
      </div>

      {/* Right: Controls */}
      <div className="flex items-center">
        {/* Navigation buttons */}
        <div className="relative flex items-center rounded-md bg-ak-surface-base shadow-sm ring-1 ring-ak-border-default md:items-stretch">
          <button
            type="button"
            onClick={onPrev}
            className="flex h-9 w-12 items-center justify-center rounded-l-md pr-1 text-ak-text-tertiary hover:text-ak-text-secondary focus:relative md:w-9 md:pr-0 md:hover:bg-ak-surface-subtle transition-colors"
            aria-label="Forrige"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onToday}
            className="hidden px-3.5 text-sm font-semibold text-ak-text-primary hover:bg-ak-surface-subtle focus:relative md:block transition-colors"
          >
            I dag
          </button>
          <span className="relative -mx-px h-5 w-px bg-ak-border-default md:hidden" />
          <button
            type="button"
            onClick={onNext}
            className="flex h-9 w-12 items-center justify-center rounded-r-md pl-1 text-ak-text-tertiary hover:text-ak-text-secondary focus:relative md:w-9 md:pl-0 md:hover:bg-ak-surface-subtle transition-colors"
            aria-label="Neste"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Desktop controls */}
        <div className="hidden md:ml-4 md:flex md:items-center">
          {/* View switcher dropdown */}
          <Menu as="div" className="relative">
            <MenuButton className="flex items-center gap-x-1.5 rounded-md bg-ak-surface-base px-3 py-2 text-sm font-semibold text-ak-text-primary shadow-sm ring-1 ring-ak-border-default hover:bg-ak-surface-subtle transition-colors">
              {VIEW_LABELS[view]}
              <ChevronDown className="-mr-1 h-5 w-5 text-ak-text-tertiary" />
            </MenuButton>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-ak-surface-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none">
                <div className="py-1">
                  {VIEW_OPTIONS.map((option) => (
                    <MenuItem key={option.value}>
                      {({ active }) => (
                        <button
                          onClick={() => onViewChange(option.value)}
                          className={clsx(
                            'block w-full px-4 py-2 text-left text-sm',
                            active
                              ? 'bg-ak-surface-subtle text-ak-text-primary'
                              : 'text-ak-text-secondary',
                            view === option.value && 'font-semibold'
                          )}
                        >
                          {option.label}
                        </button>
                      )}
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Transition>
          </Menu>

          {/* Divider */}
          <div className="ml-6 h-6 w-px bg-ak-border-default" />

          {/* Add event button */}
          {onAddEvent && (
            <button
              type="button"
              onClick={onAddEvent}
              className="ml-6 flex items-center gap-1.5 rounded-md bg-ak-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-ak-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ak-primary transition-colors"
            >
              <Plus className="h-4 w-4" />
              {addEventLabel}
            </button>
          )}
        </div>

        {/* Mobile menu */}
        <Menu as="div" className="relative ml-6 md:hidden">
          <MenuButton className="flex items-center rounded-full text-ak-text-tertiary hover:text-ak-text-secondary outline-offset-8">
            <span className="sr-only">Åpne meny</span>
            <MoreHorizontal className="h-5 w-5" />
          </MenuButton>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-ak-border-subtle overflow-hidden rounded-md bg-ak-surface-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none">
              {/* Add event */}
              {onAddEvent && (
                <div className="py-1">
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={onAddEvent}
                        className={clsx(
                          'block w-full px-4 py-2 text-left text-sm',
                          active ? 'bg-ak-surface-subtle text-ak-text-primary' : 'text-ak-text-secondary'
                        )}
                      >
                        {addEventLabel}
                      </button>
                    )}
                  </MenuItem>
                </div>
              )}

              {/* Today */}
              <div className="py-1">
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={onToday}
                      className={clsx(
                        'block w-full px-4 py-2 text-left text-sm',
                        active ? 'bg-ak-surface-subtle text-ak-text-primary' : 'text-ak-text-secondary'
                      )}
                    >
                      Gå til i dag
                    </button>
                  )}
                </MenuItem>
              </div>

              {/* View options */}
              <div className="py-1">
                {VIEW_OPTIONS.map((option) => (
                  <MenuItem key={option.value}>
                    {({ active }) => (
                      <button
                        onClick={() => onViewChange(option.value)}
                        className={clsx(
                          'block w-full px-4 py-2 text-left text-sm',
                          active ? 'bg-ak-surface-subtle text-ak-text-primary' : 'text-ak-text-secondary',
                          view === option.value && 'font-semibold'
                        )}
                      >
                        {option.label}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </div>
            </MenuItems>
          </Transition>
        </Menu>
      </div>
    </header>
  );
};

export default CalendarHeader;
