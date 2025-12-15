import { View, Text } from "react-native";
import { Sparkles } from "lucide-react-native";
import { Card, CardContent } from "../ui/Card";

export function DailyInsightCard() {
  return (
    <Card className="bg-primary border-0">
      <CardContent className="p-4 flex-row items-start gap-3">
        <View className="p-2 bg-primary-foreground/20 rounded-lg">
          <Sparkles size={20} className="text-primary-foreground" />
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-sm text-primary-foreground">Daily Insight</Text>
          <Text className="text-sm text-primary-foreground/90 mt-1">
            You're most productive between 10 AM and 12 PM. Schedule important tasks during this window!
          </Text>
        </View>
      </CardContent>
    </Card>
  );
}