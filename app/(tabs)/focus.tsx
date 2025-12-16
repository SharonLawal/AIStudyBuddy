import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Play, Pause, RotateCcw } from "lucide-react-native";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import Svg, { Circle } from "react-native-svg";

export default function FocusScreen() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [customTime, setCustomTime] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            setIsActive(false);
            Alert.alert("Focus Time Completed!", "Great job! Take a break.");
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

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  const setCustomDuration = () => {
    const time = parseInt(customTime);
    if (!isNaN(time) && time > 0) {
      setMinutes(time);
      setSeconds(0);
      setCustomTime("");
      setIsActive(false);
    }
  };

  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const timeLeft = minutes * 60 + seconds;
  const totalTime = 25 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const isRunning = isActive && timeLeft > 0;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-1 items-center justify-center p-6 gap-8">
        {/* Header */}
        <View className="items-center">
          <Text className="text-3xl font-bold text-foreground">
            Focus Timer
          </Text>
          <Text className="text-muted-foreground">
            Stay productive & focused
          </Text>
        </View>

        {/* Timer Circle - Neumorphic Style compatible with Dark Mode */}
        <View className="w-64 h-64 rounded-full border-[8px] border-primary/20 items-center justify-center bg-card shadow-xl dark:shadow-none dark:border-primary/30">
          <Text className="text-6xl font-bold text-primary tabular-nums">
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </Text>
          <Text className="text-sm text-muted-foreground mt-2 font-medium uppercase tracking-widest">
            {isActive ? "Running" : "Paused"}
          </Text>
        </View>

        {/* Controls */}
        <View className="flex-row gap-6">
          <TouchableOpacity
            onPress={toggleTimer}
            className="w-16 h-16 bg-primary rounded-full items-center justify-center shadow-lg shadow-primary/30"
          >
            {isActive ? (
              <Pause size={28} color="white" />
            ) : (
              <Play size={28} color="white" className="ml-1" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={resetTimer}
            className="w-16 h-16 bg-secondary rounded-full items-center justify-center"
          >
            <RotateCcw size={24} className="text-secondary-foreground" />
          </TouchableOpacity>
        </View>

        {/* Custom Input */}
        <View className="w-full max-w-xs gap-3">
          <Text className="text-foreground font-medium ml-1">
            Set Custom Time (min)
          </Text>
          <View className="flex-row gap-3">
            <Input
              value={customTime}
              onChangeText={setCustomTime}
              placeholder="25"
              keyboardType="number-pad"
              className="flex-1 text-center font-bold h-14 text-lg bg-muted border-border"
            />
            <Button
              onPress={setCustomDuration}
              variant="outline"
              className="w-24 border-primary/50 h-14"
            >
              <Text className="text-primary font-bold">Set</Text>
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
