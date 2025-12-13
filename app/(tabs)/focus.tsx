import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Svg, Circle } from "react-native-svg";
import { Play, Pause, Square, RotateCcw, Shield } from "lucide-react-native";
import { Card, CardContent } from "@/components/ui/Card";

export default function FocusScreen() {
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [distractionBlock, setDistractionBlock] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer Logic
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const progress = (selectedDuration * 60 - timeLeft) / (selectedDuration * 60);
  const strokeDashoffset = circumference * progress;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    } else if (timeLeft === 0) setIsRunning(false);
    return () => clearInterval(intervalRef.current!);
  }, [isRunning, timeLeft]);

  // Format MM:SS
  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const secs = (s % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950 p-4 items-center">
      <Text className="text-2xl font-bold text-white mb-8">Focus Mode</Text>

      {/* SVG Timer */}
      <View className="relative items-center justify-center mb-10">
        <Svg
          width="240"
          height="240"
          style={{ transform: [{ rotate: "-90deg" }] }}
        >
          <Circle
            cx="120"
            cy="120"
            r={radius}
            stroke="#1e293b"
            strokeWidth="8"
            fill="none"
          />
          <Circle
            cx="120"
            cy="120"
            r={radius}
            stroke="#4f46e5"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
        <View className="absolute items-center">
          <Text className="text-5xl font-bold text-white tabular-nums">
            {formatTime(timeLeft)}
          </Text>
          <Text className="text-slate-400 mt-1">
            {isRunning ? "Focusing..." : "Ready?"}
          </Text>
        </View>
      </View>

      {/* Durations */}
      <View className="flex-row gap-3 mb-10">
        {[25, 45, 60].map((m) => (
          <TouchableOpacity
            key={m}
            onPress={() => {
              setIsRunning(false);
              setSelectedDuration(m);
              setTimeLeft(m * 60);
            }}
            className={`px-5 py-2 rounded-full ${
              selectedDuration === m ? "bg-indigo-600" : "bg-slate-800"
            }`}
          >
            <Text className="text-white font-medium">{m}m</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Controls */}
      <View className="flex-row gap-6 mb-8">
        {!isRunning ? (
          <TouchableOpacity
            onPress={() => setIsRunning(true)}
            className="w-16 h-16 bg-indigo-600 rounded-full items-center justify-center"
          >
            <Play fill="white" color="white" />
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => setIsRunning(false)}
              className="w-16 h-16 border border-slate-600 rounded-full items-center justify-center"
            >
              <Pause fill="white" color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsRunning(false);
                setTimeLeft(selectedDuration * 60);
              }}
              className="w-16 h-16 bg-red-500/20 rounded-full items-center justify-center"
            >
              <Square fill="#ef4444" color="#ef4444" />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Feature Toggle */}
      <Card className="w-full">
        <CardContent className="flex-row items-center justify-between pt-6">
          <View className="flex-row items-center gap-3">
            <Shield size={20} color="#2dd4bf" />
            <Text className="text-white font-medium">Block Distractions</Text>
          </View>
          <TouchableOpacity
            onPress={() => setDistractionBlock(!distractionBlock)}
            className={`w-10 h-6 rounded-full ${
              distractionBlock ? "bg-indigo-600" : "bg-slate-700"
            }`}
          >
            <View
              className={`w-4 h-4 bg-white rounded-full mt-1 ml-1 transition-all ${
                distractionBlock ? "translate-x-4" : ""
              }`}
            />
          </TouchableOpacity>
        </CardContent>
      </Card>
    </SafeAreaView>
  );
}
