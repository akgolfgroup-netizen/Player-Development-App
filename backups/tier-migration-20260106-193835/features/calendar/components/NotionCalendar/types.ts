/**
 * Shared types and constants for NotionCalendar components
 * Extracted to avoid circular dependencies
 */

// Calendar color definitions matching Notion's palette
export const CALENDAR_COLORS = {
  red: { bg: '#FFEBE9', border: '#E5534B', text: '#C4231C' },
  orange: { bg: '#FFF1E5', border: '#E07D4C', text: '#BC4B00' },
  yellow: { bg: '#FFF8E1', border: '#C9A227', text: '#866118' },
  green: { bg: '#E6F6E6', border: '#4CAF50', text: '#2E7D32' },
  teal: { bg: '#E0F7F6', border: '#26A69A', text: '#00796B' },
  blue: { bg: '#E3F2FD', border: '#2196F3', text: '#1565C0' },
  purple: { bg: '#F3E5F5', border: '#9C27B0', text: '#7B1FA2' },
  pink: { bg: '#FCE4EC', border: '#E91E63', text: '#AD1457' },
  gray: { bg: '#F5F5F5', border: '#9E9E9E', text: '#616161' },
} as const;

export type CalendarColorKey = keyof typeof CALENDAR_COLORS;

export interface CalendarSource {
  id: string;
  name: string;
  color: CalendarColorKey;
  visible: boolean;
  isDefault?: boolean;
}

export type ViewType = 'day' | 'week' | 'month';
