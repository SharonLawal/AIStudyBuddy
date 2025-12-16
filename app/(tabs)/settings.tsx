import { View, Text, Switch, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Moon, Sun, Bell, User, LogOut } from "lucide-react-native";
import { supabase } from "../../libs/supabase";
import { useAuth } from "../../providers/AuthProvider";

export default function SettingsScreen() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { user } = useAuth();
  const isDark = colorScheme === "dark";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
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
              <Text className="text-sm text-muted-foreground">{user?.email}</Text>
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
                    <Text className="font-semibold text-foreground">Dark Mode</Text>
                    <Text className="text-xs text-muted-foreground">Easier on the eyes</Text>
                  </View>
                </View>
                <Switch 
                  value={isDark} 
                  onValueChange={toggleColorScheme}
                  trackColor={{ false: '#e2e8f0', true: '#7c3aed' }}
                  thumbColor={isDark ? "#ffffff" : "#ffffff"}
                />
              </View>

              {/* Notifications */}
              <View className="flex-row items-center justify-between p-4">
                <View className="flex-row items-center gap-3">
                  <View className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                    <Bell size={20} color={isDark ? "#93c5fd" : "#2563eb"} />
                  </View>
                  <View>
                    <Text className="font-semibold text-foreground">Notifications</Text>
                    <Text className="text-xs text-muted-foreground">Study reminders</Text>
                  </View>
                </View>
                <Switch value={true} trackColor={{ false: '#e2e8f0', true: '#7c3aed' }} />
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Actions */}
        <Button 
          variant="destructive" 
          className="flex-row gap-2 mt-4" 
          onPress={() => supabase.auth.signOut()}
        >
          <LogOut size={18} color="white" />
          <Text className="text-white font-bold">Sign Out</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}