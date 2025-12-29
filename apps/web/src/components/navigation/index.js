/**
 * Navigation Components
 *
 * Left Rail + Flyout Navigation System
 * Designed for premium professional golf development platform.
 *
 * Exports:
 * - NavigationProvider: Context provider for navigation state
 * - useNavigation: Hook to access navigation state
 * - SideNavigationDesktop: Desktop rail + flyout navigation
 * - SideNavigationMobile: Mobile header + drawer navigation
 * - NavRail: Rail primitive
 * - NavFlyout: Flyout primitive
 * - navigationSections: Navigation data structure
 */

export { NavigationProvider, useNavigation } from './NavigationContext';
export { default as SideNavigationDesktop } from './SideNavigationDesktop';
export { default as SideNavigationMobile } from './SideNavigationMobile';
export { default as NavRail } from './NavRail';
export { default as NavFlyout } from './NavFlyout';
export { navigationSections, getSectionById, getSectionByPath } from './navigationData';
