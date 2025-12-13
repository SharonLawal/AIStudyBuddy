import { useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Sparkles, BookOpen, GraduationCap, Coffee, Dumbbell } from "lucide-react-native";

const mockSchedule = [
  { id: "1", startTime: "09:00", endTime: "10:00", title: "Mathematics", type: "fixed", category: "class" },
  { id: "2", startTime: "10:15", endTime: "11:00", title: "Study: Calculus", type: "ai-suggested", category: "study" },
  { id: "3", startTime: "12:00", endTime: "13:00", title: "Lunch Break", type: "fixed", category: "break" },
];

const categoryIcons: any = { class: GraduationCap, study: BookOpen, break: Coffee, activity: Dumbbell };

export default function PlannerScreen() {
  const [schedule, setSchedule] = useState(mockSchedule);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleMagicGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // Simulate adding a task
      setSchedule([...schedule, { id: Date.now().toString(), startTime: "14:00", endTime: "15:00", title: "New AI Task", type: "ai-suggested", category: "study" }]);
    }, 1500);
  };

  return (
    <View className="flex-1 bg-background p-4 relative">
      <View className="mb-4">
        <Text className="text-2xl font-bold text-foreground">Today's Plan</Text>
        <Text className="text-muted-foreground text-sm">Thursday, December 12</Text>
      </View>

      <FlatList
        data={schedule}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-3 pb-20"
        renderItem={({ item }) => {
          const Icon = categoryIcons[item.category];
          const isFixed = item.type === "fixed";
          return (
            <Card className={`border-l-4 ${isFixed ? "border-l-primary" : "border-l-secondary"}`}>
              <CardContent className="p-3 flex-row items-center gap-3">
                <View className={`p-2 rounded-lg ${isFixed ? "bg-primary/10" : "bg-secondary/20"}`}>
                  <Icon size={16} className={isFixed ? "text-primary" : "text-secondary"} />
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-foreground text-sm">{item.title}</Text>
                  <Text className="text-xs text-muted-foreground">{item.startTime} - {item.endTime}</Text>
                </View>
                {!isFixed && <View className="px-2 py-1 bg-secondary/20 rounded-full"><Text className="text-[10px] text-secondary font-bold">AI</Text></View>}
              </CardContent>
            </Card>
          );
        }}
      />

      <Button
        onPress={handleMagicGenerate}
        disabled={isGenerating}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-secondary items-center justify-center shadow-lg"
      >
        {isGenerating ? <ActivityIndicator color="#fff" /> : <Sparkles size={24} className="text-secondary-foreground" />}
      </Button>
    </View>
  );
}