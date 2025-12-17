import {
  View,
  Text,
  Switch,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Moon, Sun, Bell, User, LogOut, Clock } from "lucide-react-native";
import { supabase } from "../../libs/supabase";
import { useAuth } from "../../providers/AuthProvider";
import * as Notifications from "expo-notifications";
import { useState, useEffect } from "react";
import { useNotification } from "../../providers/NotificationProvider";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function SettingsScreen() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { user } = useAuth();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const { showNotification } = useNotification();

  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    checkNotificationStatus();
    const defaultTime = new Date();
    defaultTime.setHours(18, 0, 0, 0);
    setReminderTime(defaultTime);
  }, []);

  async function checkNotificationStatus() {
    const settings = await Notifications.getPermissionsAsync();
    setIsNotificationsEnabled(
      settings.granted || settings.status === "granted"
    );
  }

  async function scheduleReminder(time: Date) {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time to Study! 📚",
          body: "Consistency is key. Spend 15 minutes on your quizzes today.",
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: time.getHours(),
          minute: time.getMinutes(),
        },
      });
    } catch (error: any) {
      showNotification(
        "error",
        "Error",
        "Failed to schedule: " + error.message
      );
    }
  }

  async function toggleNotifications(value: boolean) {
    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        showNotification(
          "error",
          "Permission Denied",
          "Please enable notifications in settings."
        );
        setIsNotificationsEnabled(false);
        return;
      }
      setIsNotificationsEnabled(true);
      scheduleReminder(reminderTime);
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setIsNotificationsEnabled(false);
    }
  }

  const onTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowTimePicker(false);
    if (selectedDate) {
      setReminderTime(selectedDate);
      if (isNotificationsEnabled) scheduleReminder(selectedDate);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView className="flex-1 p-4 gap-6">
        <Text className="text-3xl font-bold text-foreground">Settings</Text>

        {/* Profile Card */}
        <Card className="border border-border shadow-sm bg-card dark:border-white/10">
          <CardContent className="p-4 flex-row items-center gap-4">
            <View className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center">
              <User size={24} color="#7c3aed" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-lg text-foreground">
                {user?.user_metadata?.full_name || "Study Buddy"}
              </Text>
              <Text className="text-sm text-muted-foreground">
                {user?.email}
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Preferences */}
        <View className="gap-4">
          <Text className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">
            Preferences
          </Text>

          <Card>
            <CardContent className="p-0">
              {/* Theme Toggle */}
              <View className="flex-row items-center justify-between p-4 border-b border-border dark:border-white/5">
                <View className="flex-row items-center gap-3">
                  <View className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                    {isDark ? (
                      <Moon size={20} color="#d8b4fe" />
                    ) : (
                      <Sun size={20} color="#7c3aed" />
                    )}
                  </View>
                  <View>
                    <Text className="font-semibold text-foreground">
                      Dark Mode
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      Easier on the eyes
                    </Text>
                  </View>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={toggleColorScheme}
                  trackColor={{ false: "#e2e8f0", true: "#7c3aed" }}
                />
              </View>

              {/* Notifications Toggle */}
              <View className="flex-row items-center justify-between p-4 border-b border-border/50">
                <View className="flex-row items-center gap-3">
                  <View className="bg-orange-100 p-2 rounded-lg">
                    <Bell size={20} className="text-orange-600" />
                  </View>
                  <Text className="text-base font-medium text-foreground">
                    Daily Reminders
                  </Text>
                </View>
                <Switch
                  value={isNotificationsEnabled}
                  onValueChange={toggleNotifications}
                  trackColor={{ false: "#767577", true: "#7c3aed" }}
                />
              </View>

              {/* Reminder Time Picker */}
              {isNotificationsEnabled && (
                <View className="flex-row items-center justify-between p-4 border-b border-border/50 bg-muted/20">
                  <View className="flex-row items-center gap-3 pl-2">
                    <Clock size={16} className="text-muted-foreground" />
                    <Text className="text-base text-muted-foreground">
                      Reminder Time
                    </Text>
                  </View>

                  {Platform.OS === "ios" ? (
                    <DateTimePicker
                      value={reminderTime}
                      mode="time"
                      display="compact"
                      onChange={onTimeChange}
                      style={{ width: 100 }}
                    />
                  ) : (
                    <TouchableOpacity
                      onPress={() => setShowTimePicker(true)}
                      className="bg-background border border-border px-3 py-1 rounded-md"
                    >
                      <Text className="text-primary font-bold">
                        {formatTime(reminderTime)}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </CardContent>
          </Card>
        </View>

        {/* Sign Out */}
        <Button
          variant="destructive"
          className="flex-row gap-2 mt-4"
          onPress={() => {
            Alert.alert("Sign Out", "Are you sure?", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Sign Out",
                style: "destructive",
                onPress: async () => {
                  await supabase.auth.signOut();
                  router.replace("/(auth)/login");
                },
              },
            ]);
          }}
        >
          <LogOut size={18} color="white" />
          <Text className="text-white font-bold">Sign Out</Text>
        </Button>

        {showTimePicker && Platform.OS === "android" && (
          <DateTimePicker
            value={reminderTime}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
