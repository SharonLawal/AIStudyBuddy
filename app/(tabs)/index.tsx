import { View, ScrollView, Text } from 'react-native';
import { Sparkles, Clock, CheckCircle2, Flame, Brain, ChevronRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// Mock Data
const weeklyData = [
  { day: "Mon", hours: 3.5 }, { day: "Tue", hours: 2.0 }, { day: "Wed", hours: 4.2 },
  { day: "Thu", hours: 1.5 }, { day: "Fri", hours: 3.0 }, { day: "Sat", hours: 2.8 }, { day: "Sun", hours: 1.2 },
];
const maxHours = Math.max(...weeklyData.map((d) => d.hours));

export default function Dashboard() {
  return (
    <SafeAreaView className="flex-1 bg-slate-950 p-4">
      <ScrollView contentContainerClassName="gap-4 pb-20">
        
        {/* Header */}
        <View>
          <Text className="text-2xl font-bold text-white">Good Morning, Alex</Text>
          <Text className="text-slate-400 text-sm">Let's make today productive!</Text>
        </View>

        {/* Daily Insight */}
        <Card className="bg-indigo-600 border-indigo-500">
          <CardContent className="flex-row items-start gap-3 pt-6">
            <View className="p-2 bg-white/20 rounded-lg">
              <Sparkles size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-white mb-1">Daily Insight</Text>
              <Text className="text-white/90 text-sm">You're most productive between 10 AM and 12 PM.</Text>
            </View>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <View className="flex-row gap-3">
          {[
            { label: 'Focus', value: '2h 15m', icon: Clock, color: '#818cf8' },
            { label: 'Done', value: '7', icon: CheckCircle2, color: '#2dd4bf' },
            { label: 'Streak', value: '12', icon: Flame, color: '#fbbf24' },
          ].map((stat, i) => (
            <Card key={i} className="flex-1 bg-slate-900 border-slate-800">
              <CardContent className="items-center py-4 pt-4 px-2">
                <stat.icon size={20} color={stat.color} />
                <Text className="text-lg font-bold text-white mt-2">{stat.value}</Text>
                <Text className="text-xs text-slate-400">{stat.label}</Text>
              </CardContent>
            </Card>
          ))}
        </View>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Your study hours</CardDescription>
          </CardHeader>
          <CardContent>
            <View className="flex-row items-end justify-between h-32 gap-2">
              {weeklyData.map((item, i) => (
                <View key={i} className="flex-1 items-center gap-2">
                  <View className="w-full bg-slate-800 rounded-t-sm h-full justify-end overflow-hidden">
                    <View 
                      className="w-full bg-indigo-500 rounded-t-sm" 
                      style={{ height: `${(item.hours / maxHours) * 100}%` }} 
                    />
                  </View>
                  <Text className="text-xs text-slate-500">{item.day.charAt(0)}</Text>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* Suggestion */}
        <Card className="bg-teal-900/20 border-teal-800/50">
          <CardContent className="pt-6">
            <View className="flex-row items-center gap-3">
              <Brain size={24} color="#2dd4bf" />
              <View>
                <Text className="font-bold text-white">Biology - Chapter 4</Text>
                <Text className="text-xs text-teal-400">Suggested: 45 min</Text>
              </View>
            </View>
            <Button className="mt-4 bg-teal-500" onPress={() => {}}>
              <Text className="mr-2">Start Now</Text>
              <ChevronRight size={16} color="white"/>
            </Button>
          </CardContent>
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
}