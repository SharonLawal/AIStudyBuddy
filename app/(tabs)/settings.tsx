import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Moon, Bell, Brain, Trash2, ChevronRight } from "lucide-react-native";
import { Card, CardContent } from "@/components/ui/Card";

export default function Settings() {
  return (
    <SafeAreaView className="flex-1 bg-slate-950 p-4 gap-6">
      <Text className="text-2xl font-bold text-white">Settings</Text>

      {/* Profile */}
      <Card>
        <CardContent className="flex-row items-center gap-4 pt-6">
          <View className="w-12 h-12 bg-indigo-600 rounded-full items-center justify-center">
            <Text className="text-white font-bold">AS</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-lg">Alex Student</Text>
            <Text className="text-slate-400 text-sm">alex@university.edu</Text>
          </View>
          <ChevronRight color="#64748b" />
        </CardContent>
      </Card>

      {/* Options */}
      <View className="gap-3">
        {[
          { icon: Moon, label: "Dark Mode", sub: "Easier on the eyes" },
          { icon: Bell, label: "Notifications", sub: "Reminders & Tips" },
          {
            icon: Brain,
            label: "AI Personality",
            sub: "Strict vs Encouraging",
          },
        ].map((Opt, i) => (
          <Card key={i}>
            <CardContent className="flex-row items-center justify-between pt-4 pb-4">
              <View className="flex-row items-center gap-3">
                <View className="p-2 bg-slate-800 rounded-lg">
                  <Opt.icon size={20} color="white" />
                </View>
                <View>
                  <Text className="text-white font-medium">{Opt.label}</Text>
                  <Text className="text-slate-500 text-xs">{Opt.sub}</Text>
                </View>
              </View>
              {/* Mock Switch */}
              <View className="w-10 h-6 bg-indigo-600 rounded-full justify-center px-1">
                <View className="w-4 h-4 bg-white rounded-full self-end" />
              </View>
            </CardContent>
          </Card>
        ))}
      </View>

      {/* Danger */}
      <TouchableOpacity className="mt-auto bg-red-500/10 p-4 rounded-xl flex-row justify-center items-center gap-2 border border-red-500/50">
        <Trash2 size={18} color="#ef4444" />
        <Text className="text-red-500 font-bold">Clear All Data</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
