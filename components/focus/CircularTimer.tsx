import { View, Text } from "react-native";

interface CircularTimerProps {
  minutes: number;
  seconds: number;
  isActive: boolean;
}

export function CircularTimer({
  minutes,
  seconds,
  isActive,
}: CircularTimerProps) {
  return (
    <View className="w-72 h-72 rounded-full border-[8px] border-primary/10 items-center justify-center bg-card shadow-2xl dark:shadow-none dark:bg-muted/30 dark:border-white/5">
      <Text className="text-7xl font-bold text-primary tabular-nums">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </Text>
      <View
        className={`mt-4 px-3 py-1 rounded-full ${isActive ? "bg-green-100 dark:bg-green-900/30" : "bg-muted"}`}
      >
        <Text
          className={`text-xs font-bold uppercase tracking-widest ${isActive ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}
        >
          {isActive ? "Running" : "Paused"}
        </Text>
      </View>
    </View>
  );
}
