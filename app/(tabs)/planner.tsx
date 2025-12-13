import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookOpen, Coffee, Dumbbell, Sparkles } from "lucide-react-native";
import { Card, CardContent } from "@/components/ui/Card";

const schedule = [
  {
    id: 1,
    time: "09:00 - 10:00",
    title: "Mathematics",
    type: "fixed",
    icon: BookOpen,
  },
  {
    id: 2,
    time: "10:15 - 11:00",
    title: "Calculus Review",
    type: "ai",
    icon: BookOpen,
  },
  {
    id: 3,
    time: "12:00 - 13:00",
    title: "Lunch Break",
    type: "fixed",
    icon: Coffee,
  },
  { id: 4, time: "14:00 - 15:00", title: "Gym", type: "ai", icon: Dumbbell },
];

export default function Planner() {
  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="p-4 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-white">Today's Plan</Text>
        <Text className="text-slate-400">Dec 12</Text>
      </View>

      <ScrollView contentContainerClassName="p-4 gap-4 pb-24">
        {schedule.map((item) => (
          <View
            key={item.id}
            className={`bg-slate-900 p-4 rounded-xl border-l-4 flex-row items-center gap-4 ${
              item.type === "fixed"
                ? "border-l-indigo-500"
                : "border-l-teal-400 border-dashed border"
            }`}
          >
            <View
              className={`p-2 rounded-lg ${
                item.type === "fixed" ? "bg-indigo-500/20" : "bg-teal-400/20"
              }`}
            >
              <item.icon
                size={20}
                color={item.type === "fixed" ? "#6366f1" : "#2dd4bf"}
              />
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-base">
                {item.title}
              </Text>
              <Text className="text-slate-400 text-sm">{item.time}</Text>
            </View>
            {item.type === "ai" && (
              <View className="bg-teal-400/20 px-2 py-1 rounded">
                <Text className="text-teal-400 text-[10px] font-bold">
                  AI SUGGESTED
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity className="absolute bottom-6 right-6 w-14 h-14 bg-teal-400 rounded-full items-center justify-center shadow-lg">
        <Sparkles color="#0f172a" fill="#0f172a" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
