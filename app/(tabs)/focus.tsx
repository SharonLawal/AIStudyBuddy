import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Svg, Circle } from "react-native-svg";
import { Play, Pause, Square, Shield } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input"; // Use your styled Input

const durations = [25, 45, 60];

export default function FocusScreen() {
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [customDuration, setCustomDuration] = useState("");
  const [timeLeft, setTimeLeft] = useState(selectedDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [distractionBlock, setDistractionBlock] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSeconds = selectedDuration * 60;
  const progress =
    totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) setIsRunning(false);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  // Update timer when preset changes
  useEffect(() => {
    if (!isRunning) setTimeLeft(selectedDuration * 60);
  }, [selectedDuration]);

  // Handle custom input
  const handleCustomDuration = (text: string) => {
    setCustomDuration(text);
    const mins = parseInt(text);
    if (!isNaN(mins) && mins > 0) {
      setSelectedDuration(mins);
      setTimeLeft(mins * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-1 bg-background p-4 gap-6">
        <View className="items-center">
          <Text className="text-2xl font-bold text-foreground">Focus Mode</Text>
        </View>

        <View className="items-center justify-center py-4">
          <View className="relative">
            <Svg
              width={256}
              height={256}
              viewBox="0 0 256 256"
              style={{ transform: [{ rotate: "-90deg" }] }}
            >
              <Circle
                cx="128"
                cy="128"
                r={radius}
                stroke="#334155"
                strokeWidth="8"
                fill="none"
              />
              <Circle
                cx="128"
                cy="128"
                r={radius}
                stroke="#4f46e5"
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={
                  circumference - (progress / 100) * circumference
                }
                strokeLinecap="round"
              />
            </Svg>
            <View className="absolute inset-0 items-center justify-center">
              <Text className="text-5xl font-bold text-foreground">
                {formatTime(timeLeft)}
              </Text>
              <Text className="text-sm text-muted-foreground mt-2">
                {isRunning ? "Focusing..." : "Ready"}
              </Text>
            </View>
          </View>
        </View>

        {/* Preset Pills + Custom Input */}
        <View className="flex-row justify-center gap-2 items-center flex-wrap">
          {durations.map((val) => (
            <Button
              key={val}
              onPress={() => {
                if (!isRunning) {
                  setSelectedDuration(val);
                  setCustomDuration("");
                }
              }}
              className={`rounded-full h-10 px-4 ${selectedDuration === val && !customDuration ? "bg-primary" : "bg-muted"}`}
              disabled={isRunning}
            >
              <Text
                className={
                  selectedDuration === val && !customDuration
                    ? "text-primary-foreground"
                    : "text-muted-foreground"
                }
              >
                {val}m
              </Text>
            </Button>
          ))}
          {/* Custom Input */}
          <View className="w-20">
            <Input
              placeholder="Custom"
              keyboardType="numeric"
              value={customDuration}
              onChangeText={handleCustomDuration}
              className="h-10 text-center bg-muted border-0"
              editable={!isRunning}
            />
          </View>
        </View>

        {/* Controls (Play/Pause) Same as before... */}
        <View className="flex-row justify-center gap-4 items-center">
          {/* ... Control Buttons code from previous file ... */}
          {!isRunning ? (
            <Button
              onPress={() => setIsRunning(true)}
              className="w-16 h-16 rounded-full bg-primary items-center justify-center"
            >
              <Play
                size={24}
                className="text-primary-foreground ml-1"
                fill="currentColor"
              />
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onPress={() => setIsRunning(false)}
                className="w-14 h-14 rounded-full border-2 border-border bg-transparent"
              >
                <Pause
                  size={20}
                  className="text-foreground"
                  fill="currentColor"
                />
              </Button>
              <Button
                variant="destructive"
                onPress={() => {
                  setIsRunning(false);
                  setTimeLeft(selectedDuration * 60);
                }}
                className="w-14 h-14 rounded-full"
              >
                <Square size={20} className="text-white" fill="currentColor" />
              </Button>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
