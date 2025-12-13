import { useState } from "react";
import { View, Text, Switch, Image, ScrollView, Alert } from "react-native";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Moon, Bell, Brain, Trash2, ChevronRight } from "lucide-react-native";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [aiPersonality, setAiPersonality] = useState("encouraging");

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-4 gap-6">
      <View>
        <Text className="text-2xl font-bold text-foreground">Settings</Text>
        <Text className="text-muted-foreground text-sm">Customize your experience</Text>
      </View>

      <Card>
        <CardContent className="p-4 flex-row items-center gap-4">
          <View className="w-16 h-16 rounded-full bg-muted items-center justify-center overflow-hidden">
             {/* Use placeholder image or actual avatar */}
             <Text className="text-xl">👤</Text>
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-lg text-foreground">Alex Student</Text>
            <Text className="text-sm text-muted-foreground">alex.student@email.com</Text>
          </View>
          <ChevronRight size={20} className="text-muted-foreground" />
        </CardContent>
      </Card>

      <View className="gap-3">
        <Text className="text-sm font-semibold text-muted-foreground uppercase">Preferences</Text>
        
        <SettingItem icon={Moon} label="Dark Mode" sub="Easier on the eyes">
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </SettingItem>

        <SettingItem icon={Bell} label="Notifications" sub="Session reminders">
          <Switch value={notifications} onValueChange={setNotifications} />
        </SettingItem>

        <Card>
          <CardContent className="p-4 gap-3">
            <View className="flex-row items-center gap-3">
              <View className="p-2 bg-muted rounded-lg"><Brain size={20} className="text-foreground" /></View>
              <Text className="font-medium text-foreground">AI Personality</Text>
            </View>
            <View className="flex-row gap-2">
              {['encouraging', 'strict'].map(p => (
                <Button 
                  key={p} 
                  variant={aiPersonality === p ? 'default' : 'outline'} 
                  onPress={() => setAiPersonality(p)}
                  className="flex-1"
                >
                  <Text className={aiPersonality === p ? 'text-primary-foreground' : 'text-foreground'}>
                    {p === 'encouraging' ? '😊 Encouraging' : '📚 Strict'}
                  </Text>
                </Button>
              ))}
            </View>
          </CardContent>
        </Card>
      </View>

      <View className="gap-3">
        <Text className="text-sm font-semibold text-muted-foreground uppercase">Data</Text>
        <Button variant="destructive" className="flex-row gap-2 justify-center" onPress={() => Alert.alert("Clear Data", "Are you sure?")}>
          <Trash2 size={16} className="text-destructive-foreground" />
          <Text className="text-destructive-foreground font-medium">Clear All Data</Text>
        </Button>
      </View>
    </ScrollView>
  );
}

function SettingItem({ icon: Icon, label, sub, children }: any) {
  return (
    <Card>
      <CardContent className="p-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="p-2 bg-muted rounded-lg"><Icon size={20} className="text-foreground" /></View>
          <View>
            <Text className="font-medium text-foreground">{label}</Text>
            <Text className="text-xs text-muted-foreground">{sub}</Text>
          </View>
        </View>
        {children}
      </CardContent>
    </Card>
  );
}