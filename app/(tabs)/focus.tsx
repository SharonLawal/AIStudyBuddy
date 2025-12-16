import { useState, useEffect, useRef } from "react";
import { View, Text, Switch } from "react-native";
import { Svg, Circle } from "react-native-svg";
import { Play, Pause, Square, Shield } from "lucide-react-native";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

const durations = [
  { label: "25m", value: 25 },
  { label: "45m", value: 45 },
  { label: "60m", value: 60 },
];

export default function FocusScreen() {
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(selectedDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [distractionBlock, setDistractionBlock] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSeconds = selectedDuration * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) setIsRunning(false);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (!isRunning) setTimeLeft(selectedDuration * 60);
  }, [selectedDuration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View className="flex-1 bg-background p-4 gap-6">
      <View className="items-center">
        <Text className="text-2xl font-bold text-foreground">Focus Mode</Text>
        <Text className="text-muted-foreground text-sm">Stay concentrated, achieve more</Text>
      </View>

      {/* Timer Circle */}
      <View className="items-center justify-center py-4">
        <View className="relative">
          <Svg width={256} height={256} viewBox="0 0 256 256" style={{ transform: [{ rotate: "-90deg" }] }}>
            <Circle cx="128" cy="128" r={radius} stroke="#334155" strokeWidth="8" fill="none" />
            <Circle
              cx="128"
              cy="128"
              r={radius}
              stroke="#4f46e5"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (progress / 100) * circumference}
              strokeLinecap="round"
            />
          </Svg>
          <View className="absolute inset-0 items-center justify-center">
            <Text className="text-5xl font-bold text-foreground">{formatTime(timeLeft)}</Text>
            <Text className="text-sm text-muted-foreground mt-2">{isRunning ? "Focusing..." : "Ready to focus"}</Text>
          </View>
        </View>
      </View>

      {/* Duration Pills */}
      <View className="flex-row justify-center gap-3">
        {durations.map((d) => (
          <Button
            key={d.value}
            onPress={() => !isRunning && setSelectedDuration(d.value)}
            className={`rounded-full ${selectedDuration === d.value ? "bg-primary" : "bg-muted"}`}
            disabled={isRunning}
          >
            <Text className={selectedDuration === d.value ? "text-primary-foreground" : "text-muted-foreground"}>{d.label}</Text>
          </Button>
        ))}
      </View>

      {/* Controls */}
      <View className="flex-row justify-center gap-4 items-center">
        {!isRunning ? (
          <Button onPress={() => setIsRunning(true)} className="w-16 h-16 rounded-full bg-primary items-center justify-center">
            <Play size={24} className="text-primary-foreground ml-1" fill="currentColor" />
          </Button>
        ) : (
          <>
            <Button variant="outline" onPress={() => setIsRunning(false)} className="w-14 h-14 rounded-full border-2 border-border bg-transparent">
              <Pause size={20} className="text-foreground" fill="currentColor" />
            </Button>
            <Button variant="destructive" onPress={() => { setIsRunning(false); setTimeLeft(selectedDuration * 60); }} className="w-14 h-14 rounded-full">
              <Square size={20} className="text-white" fill="currentColor" />
            </Button>
          </>
        )}
      </View>

      {/* AI Distraction Blocking */}
      <Card>
        <CardContent className="p-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="p-2 bg-secondary/20 rounded-lg">
              <Shield size={20} className="text-secondary" />
            </View>
            <View>
              <Text className="font-medium text-foreground">AI Distraction Blocking</Text>
              <Text className="text-xs text-muted-foreground">Block distracting apps</Text>
            </View>
          </View>
          <Switch value={distractionBlock} onValueChange={setDistractionBlock} />
        </CardContent>
      </Card>
    </View>
  );
}