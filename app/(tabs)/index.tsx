import { View, Text, ScrollView } from "react-native";
import {
  Sparkles,
  Clock,
  CheckCircle2,
  Flame,
  Brain,
  ChevronRight,
} from "lucide-react-native";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

const mockStats = {
  focusTime: "2h 15m",
  tasksCompleted: 7,
  streak: 12,
};

const weeklyData = [
  { day: "Mon", hours: 3.5 },
  { day: "Tue", hours: 2.0 },
  { day: "Wed", hours: 4.2 },
  { day: "Thu", hours: 1.5 },
  { day: "Fri", hours: 3.0 },
  { day: "Sat", hours: 2.8 },
  { day: "Sun", hours: 1.2 },
];

const maxHours = Math.max(...weeklyData.map((d) => d.hours));

export default function DashboardScreen() {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 17
        ? "Good Afternoon"
        : "Good Evening";

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 gap-4"
    >
      {/* Header */}
      <View className="space-y-1">
        <Text className="text-2xl font-bold text-foreground">
          {greeting}, Alex
        </Text>
        <Text className="text-muted-foreground text-sm">
          Let's make today productive!
        </Text>
      </View>

      {/* Daily Insight Card */}
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
              You're most productive between 10 AM and 12 PM. Schedule important
              tasks during this window!
            </Text>
          </View>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <View className="flex-row gap-3">
        <StatsCard
          icon={Clock}
          value={mockStats.focusTime}
          label="Focus Today"
          iconColor="text-primary"
          bg="bg-primary/10"
        />
        <StatsCard
          icon={CheckCircle2}
          value={mockStats.tasksCompleted}
          label="Tasks Done"
          iconColor="text-secondary"
          bg="bg-secondary/20"
        />
        <StatsCard
          icon={Flame}
          value={mockStats.streak}
          label="Day Streak"
          iconColor="text-destructive"
          bg="bg-destructive/20"
        />
      </View>

      {/* Weekly Activity Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Weekly Activity</CardTitle>
          <CardDescription>Your study hours this week</CardDescription>
        </CardHeader>
        <CardContent>
          <View className="flex-row items-end justify-between gap-2 h-32 pt-4">
            {weeklyData.map((item) => (
              <View key={item.day} className="flex-1 items-center gap-2">
                <View className="w-full bg-muted rounded-t-md flex-1 justify-end overflow-hidden">
                  <View
                    className="w-full bg-primary rounded-t-md"
                    style={{ height: `${(item.hours / maxHours) * 100}%` }}
                  />
                </View>
                <Text className="text-xs text-muted-foreground">
                  {item.day}
                </Text>
              </View>
            ))}
          </View>
        </CardContent>
      </Card>

      {/* AI Suggestion Card */}
      <Card className="bg-secondary/10 border-secondary/30">
        <CardContent className="p-4">
          <View className="flex-row items-center gap-3">
            <View className="p-3 bg-secondary/20 rounded-xl">
              <Brain size={24} className="text-secondary" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-foreground">
                Recommended Next Session
              </Text>
              <Text className="text-sm text-muted-foreground">
                Biology - Chapter 4 Review
              </Text>
              <Text className="text-xs text-muted-foreground mt-1">
                Suggested: 45 minutes
              </Text>
            </View>
          </View>
          <Button
            className="w-full mt-4 bg-secondary"
            onPress={() => console.log("Start AI Session")}
          >
            <Text className="text-secondary-foreground font-medium">
              Start Now
            </Text>{" "}
            <ChevronRight
              size={16}
              className="text-secondary-foreground ml-1"
            />
          </Button>
        </CardContent>
      </Card>
    </ScrollView>
  );
}

function StatsCard({ icon: Icon, value, label, iconColor, bg }: any) {
  return (
    <Card className="flex-1 bg-card">
      <CardContent className="p-3 items-center justify-center">
        <View
          className={`w-10 h-10 rounded-full ${bg} items-center justify-center mb-2`}
        >
          <Icon size={20} className={iconColor} />
        </View>
        <Text className="text-lg font-bold text-foreground">{value}</Text>
        <Text className="text-xs text-muted-foreground">{label}</Text>
      </CardContent>
    </Card>
  );
}
