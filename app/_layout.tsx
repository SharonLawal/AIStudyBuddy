import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../providers/AuthProvider';
import { ToastProvider } from '../components/ui/Toast';
import { NotificationProvider } from '../providers/NotificationProvider';
import "../global.css";

function RootLayoutNav() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, loading, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ToastProvider>
        <NotificationProvider>
          <RootLayoutNav />
          <StatusBar style="auto" /> 
        </NotificationProvider>
      </ToastProvider>
    </AuthProvider>
  );
}