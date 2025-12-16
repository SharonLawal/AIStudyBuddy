import { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Sparkles,
  Clock,
  CheckCircle2,
  Flame,
  User,
} from "lucide-react-native";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { useAuth } from "../../providers/AuthProvider";
import { useColorScheme } from "nativewind";

const insights = [
  "You're most productive between 10 AM and 12 PM. Schedule hard tasks then!",
  "Taking a 5-minute break every hour improves retention by 20%.",
  "Reviewing notes before bed helps consolidate memory.",
  "Drink water! Hydration boosts cognitive function.",
];

export default function DashboardScreen() {
  const { user } = useAuth();
  const [insight, setInsight] = useState("");
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    setInsight(insights[Math.floor(Math.random() * insights.length)]);
  }, []);

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 17
        ? "Good Afternoon"
        : "Good Evening";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="p-4 gap-4"
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-lg font-medium text-muted-foreground">
              {greeting},
            </Text>
            <Text className="text-3xl font-bold text-foreground">
              {user?.user_metadata?.full_name?.split(" ")[0] || "Student"}
            </Text>
          </View>
          <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center border border-primary/20">
            <User size={24} color="#7c3aed" />
          </View>
        </View>

        {/* Dynamic Daily Insight */}
        <Card className="bg-primary border-0">
          <CardContent className="p-4 flex-row items-start gap-3">
            <View className="p-2 bg-primary-foreground/20 rounded-lg">
              <Sparkles size={20} color="#ffffff" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-sm text-primary-foreground">
                Daily Insight
              </Text>
              <Text className="text-sm text-primary-foreground/90 mt-1">
                {insight}
              </Text>
            </View>
          </CardContent>
        </Card>

        <View className="flex-row gap-3">
          <StatsCard
            icon={Clock}
            value="2h 15m"
            label="Focus"
            color="#7c3aed"
            bg="bg-purple-100 dark:bg-purple-900/40"
          />
          <StatsCard
            icon={CheckCircle2}
            value={7}
            label="Done"
            color="#2563eb"
            bg="bg-blue-100 dark:bg-blue-900/40"
          />
          <StatsCard
            icon={Flame}
            value={12}
            label="Streak"
            color="#ea580c"
            bg="bg-orange-100 dark:bg-orange-900/40"
          />
        </View>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="h-32 bg-muted/20 rounded-md items-center justify-center">
              <Text className="text-muted-foreground">
                Chart Implementation Pending
              </Text>
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
