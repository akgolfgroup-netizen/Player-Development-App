/**
 * AK Golf Mobile App - Main Entry Point
 *
 * React Native app for golfers with:
 * - Session tracking
 * - Video proof capture
 * - Offline-first sync
 * - Push notifications
 */

import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SyncProvider } from './contexts/SyncContext';

// Screens
import LoginScreen from './screens/LoginScreen';
import HomeScreen from '../screens/HOME';
import SessionScreen from '../screens/SESSION';
import ReflectionScreen from '../screens/REFLECTION';
import BaselineScreen from '../screens/BASELINE';
import TrajectoryScreen from '../screens/TRAJECTORY';
import ProofScreen from '../screens/PROOF';

// Types
import { RootStackParamList } from './navigation/types';

// Suppress known warnings in development
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

const Stack = createNativeStackNavigator<RootStackParamList>();

// Auth Navigator - shown when not logged in
function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

// Main Navigator - shown when logged in
function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Session" component={SessionScreen} />
      <Stack.Screen name="Reflection" component={ReflectionScreen} />
      <Stack.Screen name="Baseline" component={BaselineScreen} />
      <Stack.Screen name="Trajectory" component={TrajectoryScreen} />
      <Stack.Screen name="Proof" component={ProofScreen} />
    </Stack.Navigator>
  );
}

// Root Navigator - switches between auth and main
function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Could show splash screen here
    return null;
  }

  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
}

// Main App Component
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SyncProvider>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />
            <RootNavigator />
          </NavigationContainer>
        </SyncProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
