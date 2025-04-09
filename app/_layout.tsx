import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuthStore } from '@/stores/auth';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { setupLocationTracking } from '../utils/locationMatching';

export default function RootLayout() {
  const isFrameworkReady = useFrameworkReady();
  const { initialize, isLoading } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const initApp = async () => {
      await initialize();
      setIsInitializing(false);
    };
    
    initApp();
  }, [initialize]);

  useEffect(() => {
    if (user) {
      setupLocationTracking(user.id).catch(console.error);
    }
  }, [user]);

  if (!isFrameworkReady || isLoading || isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF3B30" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(relationship-tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="chat-room/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}








