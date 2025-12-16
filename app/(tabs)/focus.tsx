import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Play, Pause, RotateCcw } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { CircularTimer } from "../../components/focus/CircularTimer";

export default function FocusScreen() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [customTime, setCustomTime] = useState("");

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            setIsActive(false);
            Alert.alert("Finished!", "Good focus session!");
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const setCustomDuration = () => {
    const time = parseInt(customTime);
    if (!isNaN(time) && time > 0) {
      setMinutes(time);
      setSeconds(0);
      setCustomTime("");
      setIsActive(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-1 items-center justify-center p-6 gap-10">
        <View className="items-center">
          <Text className="text-3xl font-bold text-foreground">
            Focus Timer
          </Text>
          <Text className="text-muted-foreground">Stay in the zone</Text>
        </View>

        <CircularTimer
          minutes={minutes}
          seconds={seconds}
          isActive={isActive}
        />

        <View className="flex-row gap-6 items-center">
          <TouchableOpacity
            onPress={() => {
              setIsActive(false);
              setMinutes(25);
              setSeconds(0);
            }}
            className="w-16 h-16 bg-secondary rounded-full items-center justify-center"
          >
            <RotateCcw size={22} color={isDark ? "#e2e8f0" : "#475569"} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsActive(!isActive)}
            className="w-16 h-16 bg-primary rounded-full items-center justify-center shadow-lg shadow-primary/3"
          >
            {isActive ? (
              <Pause size={32} color="white" fill="white" />
            ) : (
              <Play size={32} color="white" fill="white" className="ml-1" />
            )}
          </TouchableOpacity>
        </View>

        <View className="w-full max-w-sm gap-2">
          <Text className="text-foreground font-medium ml-1">
            Set Duration (min)
          </Text>
          <View className="flex-row gap-3">
            <Input
              value={customTime}
              onChangeText={setCustomTime}
              placeholder="25"
              keyboardType="number-pad"
              className="flex-1 text-center font-bold text-lg h-14 bg-muted/50 border-border dark:bg-muted/30"
            />
            <Button
              onPress={setCustomDuration}
              variant="outline"
              className="w-24 h-14 border-primary/30 dark:border-white/10"
            >
              <Text className="text-primary font-bold">Set</Text>
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
