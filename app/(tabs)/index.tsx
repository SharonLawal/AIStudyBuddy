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

const insights = [
  "You're most productive between 10 AM and 12 PM. Schedule hard tasks then!",
  "Taking a 5-minute break every hour improves retention by 20%.",
  "Reviewing notes before bed helps consolidate memory.",
  "Drink water! Hydration boosts cognitive function.",
];

export default function DashboardScreen() {
  const { user } = useAuth();
  const [insight, setInsight] = useState("");

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
            <User size={24} className="text-primary" />
          </View>
        </View>

        {/* Dynamic Daily Insight */}
        <Card className="bg-primary border-0">
          <CardContent className="p-4 flex-row items-start gap-3">
            <View className="p-2 bg-primary-foreground/20 rounded-lg">
              <Sparkles size={20} className="text-primary-foreground" />
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
            label="Focus Today"
            iconColor="text-primary"
            bg="bg-primary/10"
          />
          <StatsCard
            icon={CheckCircle2}
            value={7}
            label="Tasks Done"
            iconColor="text-secondary"
            bg="bg-secondary/20"
          />
          <StatsCard
            icon={Flame}
            value={12}
            label="Day Streak"
            iconColor="text-destructive"
            bg="bg-destructive/20"
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
