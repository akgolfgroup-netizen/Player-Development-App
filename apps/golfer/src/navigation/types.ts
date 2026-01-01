/**
 * Navigation Types for AK Golf Mobile App
 */

export type RootStackParamList = {
  // Auth screens
  Login: undefined;

  // Main screens
  Home: undefined;
  Session: {
    sessionId: string;
    resumeFromBlock?: number;
  };
  Reflection: {
    sessionId: string;
  };
  Baseline: {
    testType?: string;
  };
  Trajectory: undefined;
  Proof: {
    sessionId?: string;
    breakingPointId?: string;
  };
};

// Navigation prop types for each screen
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
