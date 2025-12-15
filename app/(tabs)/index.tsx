import { useEffect, useState } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../libs/supabase";
import { useAuth } from "../../providers/AuthProvider";
import { DailyInsightCard } from "../../components/dashboard/DailyInsightCard";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Clock, CheckCircle2, Flame } from "lucide-react-native";

export default function DashboardScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ focusTime: 0, tasksDone: 0, streak: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const greeting = new Date().getHours() < 12 ? "Good Morning" : "Good Evening";
  const displayName = user?.user_metadata?.full_name || "Student";

  async function fetchStats() {
    if (!user) return;
    
    // Fetch completed tasks count
    const { count } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('completed', true);

    setStats(prev => ({ ...prev, tasksDone: count || 0 }));
    setRefreshing(false);
  }

  useEffect(() => {
    fetchStats();
  }, [user]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView 
        className="flex-1" 
        contentContainerClassName="p-4 gap-6"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchStats(); }} />}
      >
        <View>
          <Text className="text-2xl font-bold text-foreground">{greeting},</Text>
          <Text className="text-3xl font-bold text-primary">{displayName}</Text>
          <Text className="text-muted-foreground text-sm mt-1">Let's make today productive!</Text>
        </View>

        <DailyInsightCard />

        {/* Stats Row */}
        <View className="flex-row gap-3">
          <StatCard icon={Clock} value={`${stats.focusTime}h`} label="Focus Time" iconColor="text-primary" bg="bg-primary/10" />
          <StatCard icon={CheckCircle2} value={stats.tasksDone} label="Tasks Done" iconColor="text-secondary" bg="bg-secondary/20" />
          <StatCard icon={Flame} value={stats.streak} label="Streak" iconColor="text-destructive" bg="bg-destructive/20" />
        </View>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="h-32 bg-muted/20 rounded-md items-center justify-center">
              <Text className="text-muted-foreground">Chart Implementation Pending</Text>
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ icon: Icon, value, label, iconColor, bg }: any) {
  return (
    <Card className="flex-1 bg-card">
      <CardContent className="p-3 items-center justify-center">
        <View className={`w-10 h-10 rounded-full ${bg} items-center justify-center mb-2`}>
          <Icon size={20} className={iconColor} />
        </View>
        <Text className="text-lg font-bold text-foreground">{value}</Text>
        <Text className="text-xs text-muted-foreground">{label}</Text>
      </CardContent>
    </Card>
  );
}