import { useEffect } from "react";
import * as ScreenCapture from 'expo-screen-capture';
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
  Theme,
} from "@react-navigation/native";
import { useColorScheme } from "nativewind";
import { AuthProvider, useAuth } from "../providers/AuthProvider";
import { ToastProvider } from "../components/ui/Toast";
import { NotificationProvider } from "../providers/NotificationProvider";
import "../global.css";

const MyDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "hsl(240, 10%, 10%)",
    card: "hsl(240, 10%, 12%)", 
    text: "hsl(0, 0%, 98%)",
    border: "hsl(240, 3.7%, 15.9%)",
  },
};

const MyLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "hsl(0, 0%, 100%)",
    card: "hsl(0, 0%, 100%)",
    text: "hsl(240, 10%, 3.9%)",
    border: "hsl(240, 5.9%, 90%)",
  },
};

function RootLayoutNav() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    ScreenCapture.allowScreenCaptureAsync(); 
  }, []);

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === "(auth)";
    if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (session && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [session, loading, segments]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? MyDarkTheme : MyLightTheme}>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
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
