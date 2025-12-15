import { View, Text, ScrollView } from "react-native";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { supabase } from "../../libs/supabase";
import { useAuth } from "../../providers/AuthProvider";
import { LogOut } from "lucide-react-native";

export default function SettingsScreen() {
  const { user } = useAuth();

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-4 gap-6">
      <Text className="text-2xl font-bold text-foreground">Settings</Text>

      <Card>
        <CardContent className="p-4 gap-2">
          <Text className="text-lg font-semibold text-foreground">Profile</Text>
          <Text className="text-muted-foreground">{user?.email}</Text>
        </CardContent>
      </Card>

      <Button 
        variant="destructive" 
        className="flex-row gap-2"
        onPress={() => supabase.auth.signOut()}
      >
        <LogOut size={18} className="text-destructive-foreground" />
        <Text className="text-destructive-foreground font-medium">Sign Out</Text>
      </Button>
    </ScrollView>
  );
}