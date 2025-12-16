import { View, Text, TouchableOpacity } from "react-native";
import { Card, CardContent } from "../ui/Card";
import { BookOpen, GraduationCap, Coffee, Dumbbell } from "lucide-react-native";

const categoryConfig: any = {
  class: {
    icon: GraduationCap,
    colorHex: "#9333ea",
    bg: "bg-purple-100 dark:bg-purple-900/40",
  },
  study: {
    icon: BookOpen,
    colorHex: "#2563eb",
    bg: "bg-blue-100 dark:bg-blue-900/40",
  },
  break: {
    icon: Coffee,
    colorHex: "#ea580c",
    bg: "bg-orange-100 dark:bg-orange-900/40",
  },
  activity: {
    icon: Dumbbell,
    colorHex: "#16a34a",
    bg: "bg-green-100 dark:bg-green-900/40",
  },
};

interface ScheduleCardProps {
  item: any;
  onPress: (item: any) => void;
  displayDate: (date: string) => string;
}

export function ScheduleCard({
  item,
  onPress,
  displayDate,
}: ScheduleCardProps) {
  const config = categoryConfig[item.category] || categoryConfig.study;
  const Icon = config.icon;

  return (
    <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.7}>
      <Card className="mb-3 border border-border shadow-sm bg-card dark:border-white/10">
        <CardContent className="p-4 flex-row items-center gap-4">
          <View className="items-center justify-center w-14">
            <Text className="font-bold text-foreground">{item.start_time}</Text>
            <View className="h-8 w-[2px] bg-border my-1 rounded-full dark:bg-white/10" />
            <Text className="text-xs text-muted-foreground">
              {item.end_time}
            </Text>
          </View>

          <View className={`p-3 rounded-2xl ${config.bg}`}>
            <Icon size={20} color={config.colorHex} />
          </View>

          <View className="flex-1">
            <Text className="font-bold text-lg text-foreground">
              {item.title}
            </Text>
            <View className="flex-row items-center gap-2">
              {item.date && (
                <View className="bg-muted px-2 py-0.5 rounded-md">
                  <Text className="text-[10px] text-muted-foreground font-medium">
                    {displayDate(item.date)}
                  </Text>
                </View>
              )}
              <Text className="text-xs text-muted-foreground capitalize">
                {item.category}
              </Text>
            </View>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
}
