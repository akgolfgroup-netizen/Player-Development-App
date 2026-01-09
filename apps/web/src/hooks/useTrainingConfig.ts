/**
 * Training Configuration Hook
 *
 * Provides sport-specific training configuration data.
 * This hook abstracts the sport context and provides
 * easy-to-use training-related data.
 *
 * @example
 * const { trainingAreas, environments, phases } = useTrainingConfig();
 *
 * // Use in a form
 * <select>
 *   {trainingAreas.map(group => (
 *     <optgroup key={group.code} label={group.labelNO || group.label}>
 *       {group.areas.map(area => (
 *         <option key={area.code} value={area.code}>
 *           {area.labelNO || area.label}
 *         </option>
 *       ))}
 *     </optgroup>
 *   ))}
 * </select>
 */

import { useMemo } from 'react';
import { useSportSafe } from '../contexts/SportContext';

/**
 * Hook to get training configuration from sport context
 * Falls back to golf config if not within SportProvider
 */
export function useTrainingConfig() {
  const sport = useSportSafe();

  return useMemo(() => ({
    // Grouped training areas
    trainingAreas: sport.trainingAreas,

    // Flat list of all areas
    allAreas: sport.allTrainingAreas,

    // Training environments
    environments: sport.environments,

    // Motor learning phases
    phases: sport.phases,

    // Intensity/speed levels
    intensityLevels: sport.intensityLevels,

    // Pressure levels
    pressureLevels: sport.pressureLevels,

    // Lookup helpers
    getArea: sport.getTrainingArea,
    getEnvironment: sport.getEnvironment,
    getPhase: sport.getPhase,
    getIntensityLevel: sport.getIntensityLevel,
    getPressureLevel: sport.getPressureLevel,

    // Current sport info
    sportId: sport.sportId,
    sportName: sport.config.nameNO || sport.config.name,
    isGolf: sport.isGolf,
  }), [sport]);
}

/**
 * Hook to get goal categories from sport context
 */
export function useGoalCategories() {
  const sport = useSportSafe();

  return useMemo(() => ({
    categories: sport.goalCategories,
    getCategory: sport.getGoalCategory,
  }), [sport]);
}

/**
 * Hook to get performance metrics from sport context
 */
export function usePerformanceMetrics() {
  const sport = useSportSafe();

  return useMemo(() => ({
    metrics: sport.performanceMetrics,
    getMetric: sport.getMetric,
    benchmarkSource: sport.config.benchmarkSource,
  }), [sport]);
}

/**
 * Hook to get test protocols from sport context
 */
export function useTestProtocols() {
  const sport = useSportSafe();

  return useMemo(() => ({
    protocols: sport.testProtocols,
    getProtocol: (id: string) => sport.testProtocols.find((p) => p.id === id),
    getProtocolByNumber: (num: number) => sport.testProtocols.find((p) => p.testNumber === num),
    getProtocolsByCategory: (category: string) =>
      sport.testProtocols.filter((p) => p.category === category),
  }), [sport]);
}

/**
 * Hook to get sport terminology
 */
export function useTerminology() {
  const sport = useSportSafe();

  return useMemo(() => ({
    ...sport.terminology,
    getTerm: sport.getTerm,
  }), [sport]);
}

/**
 * Legacy compatibility: Get training areas in the old format
 * Use this during migration to gradually move components to SportContext
 *
 * @deprecated Use useTrainingConfig().trainingAreas instead
 */
export function useLegacyTrainingAreas() {
  const { trainingAreas } = useTrainingConfig();

  // Convert to old format: { fullSwing: { label, areas: [] }, ... }
  return useMemo(() => {
    const legacy: Record<string, { label: string; areas: Array<{
      code: string;
      label: string;
      icon: string;
      description: string;
      usesCS?: boolean;
    }> }> = {};

    trainingAreas.forEach((group) => {
      legacy[group.code] = {
        label: group.labelNO || group.label,
        areas: group.areas.map((area) => ({
          code: area.code,
          label: area.labelNO || area.label,
          icon: area.icon,
          description: area.descriptionNO || area.description,
          usesCS: area.usesIntensity,
        })),
      };
    });

    return legacy;
  }, [trainingAreas]);
}

/**
 * Legacy compatibility: Get environments in the old format
 *
 * @deprecated Use useTrainingConfig().environments instead
 */
export function useLegacyEnvironments() {
  const { environments } = useTrainingConfig();

  return useMemo(() => {
    return environments.map((env) => ({
      code: env.code,
      label: env.labelNO || env.label,
      description: env.descriptionNO || env.description,
      icon: env.icon,
    }));
  }, [environments]);
}

/**
 * Legacy compatibility: Get phases in the old format
 *
 * @deprecated Use useTrainingConfig().phases instead
 */
export function useLegacyPhases() {
  const { phases } = useTrainingConfig();

  return useMemo(() => {
    return phases.map((phase) => ({
      code: phase.code,
      label: phase.labelNO || phase.label,
      description: phase.descriptionNO || phase.description,
      icon: phase.icon,
      csRange: phase.intensityRange,
    }));
  }, [phases]);
}

/**
 * Legacy compatibility: Get intensity levels in the old format
 *
 * @deprecated Use useTrainingConfig().intensityLevels instead
 */
export function useLegacyIntensityLevels() {
  const { intensityLevels } = useTrainingConfig();

  return useMemo(() => {
    return intensityLevels.map((level) => ({
      code: level.code,
      value: level.value,
      label: level.labelNO || level.label,
      description: level.descriptionNO || level.description,
    }));
  }, [intensityLevels]);
}

/**
 * Legacy compatibility: Get pressure levels in the old format
 *
 * @deprecated Use useTrainingConfig().pressureLevels instead
 */
export function useLegacyPressureLevels() {
  const { pressureLevels } = useTrainingConfig();

  return useMemo(() => {
    return pressureLevels.map((level) => ({
      code: level.code,
      label: level.labelNO || level.label,
      description: level.descriptionNO || level.description,
      icon: level.icon,
    }));
  }, [pressureLevels]);
}

/**
 * Hook to get sport-specific navigation configuration
 *
 * @example
 * const { quickActions, testing } = useNavigation();
 *
 * // Render quick actions
 * quickActions.map(action => (
 *   <Link to={action.href}>
 *     {action.labelNO || action.label}
 *   </Link>
 * ));
 */
export function useNavigation() {
  const sport = useSportSafe();

  return useMemo(() => {
    const navigation = sport.config.navigation;

    // Default navigation if not defined in sport config
    const defaultNavigation = {
      quickActions: [
        {
          label: 'Log Training',
          labelNO: 'Logg trening',
          icon: 'Plus',
          href: '/trening/logg',
          variant: 'primary' as const,
        },
      ],
      testing: {
        hubPath: '/trening/testing',
        registerPath: '/trening/testing/registrer',
        resultsPath: '/analyse/tester',
        label: 'Testing',
        labelNO: 'Testing',
      },
      itemOverrides: [],
    };

    const nav = navigation || defaultNavigation;

    return {
      // Quick actions for dashboard
      quickActions: nav.quickActions,

      // Testing navigation paths
      testing: nav.testing,

      // Item overrides for customizing nav labels
      itemOverrides: nav.itemOverrides || [],

      // Helper to get override for a specific path
      getOverride: (href: string) =>
        nav.itemOverrides?.find((o) => o.targetHref === href),

      // Helper to check if an item should be hidden
      isHidden: (href: string) =>
        nav.itemOverrides?.some((o) => o.targetHref === href && o.hidden),

      // Current sport info
      sportId: sport.sportId,
      sportName: sport.config.nameNO || sport.config.name,
    };
  }, [sport]);
}

/**
 * Hook to get quick actions for dashboard
 * Returns actions formatted for Norwegian display
 */
export function useQuickActions() {
  const { quickActions } = useNavigation();

  return useMemo(() => {
    return quickActions.map((action) => ({
      label: action.labelNO || action.label,
      icon: action.icon,
      href: action.href,
      variant: action.variant,
    }));
  }, [quickActions]);
}

export default useTrainingConfig;
