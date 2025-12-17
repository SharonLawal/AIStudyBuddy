import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import {
  Sparkles,
  BookOpen,
  Clock,
  ChevronRight,
  Brain,
  FileText,
} from "lucide-react-native";
import { supabase } from "../../libs/supabase";
import { useAuth } from "../../providers/AuthProvider";

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalNotes: 0, totalQuizzes: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [user])
  );

  async function loadDashboardData() {
    if (!user) return;
    try {
      const { data: recent, error: recentError } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (recentError) throw recentError;
      setRecentNotes(recent || []);

      const { count: noteCount, error: countError } = await supabase
        .from("notes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (countError) throw countError;

      setStats({
        totalNotes: noteCount || 0,
        totalQuizzes: 0,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        className="flex-1 px-5"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadDashboardData();
            }}
          />
        }
      >
        {/* HEADER SECTION */}
        <View className="flex-row justify-between items-center mt-4 mb-6">
          <View>
            <Text className="text-muted-foreground text-sm font-medium">
              {getGreeting()},
            </Text>
            <Text className="text-2xl font-bold text-foreground">
              {user?.user_metadata?.full_name ||
                user?.user_metadata?.name ||
                user?.email?.split("@")[0] ||
                "Scholar"}{" "}
              👋
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/settings")}
            className="bg-primary/10 w-10 h-10 rounded-full items-center justify-center"
          >
            {/* Initials Avatar */}
            <Text className="text-primary font-bold text-lg">
              {(
                user?.user_metadata?.full_name?.[0] ||
                user?.email?.[0] ||
                "U"
              ).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* QUICK STATS CARD */}
        <View className="flex-row gap-3 mb-8">
          <View className="flex-1 bg-card border border-border p-4 rounded-2xl shadow-sm">
            <View className="bg-blue-100 w-8 h-8 rounded-full items-center justify-center mb-2">
              <BookOpen size={16} className="text-blue-700" />
            </View>
            <Text className="text-2xl font-bold text-foreground">
              {stats.totalNotes}
            </Text>
            <Text className="text-muted-foreground text-xs">
              Total Study Items
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/notes")}
            className="flex-1 bg-primary p-4 rounded-2xl shadow-md shadow-primary/20 justify-between"
          >
            <View className="bg-white/20 w-8 h-8 rounded-full items-center justify-center mb-2">
              <Sparkles size={16} color="white" />
            </View>
            <View>
              <Text className="text-white font-bold text-lg">New Session</Text>
              <Text className="text-white/80 text-xs">
                Generate Summary & Quiz
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* RECENT ACTIVITY SECTION */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-foreground">
            Recent Activity
          </Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/library")}>
            <Text className="text-primary text-sm font-medium">See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color="#7c3aed" className="mt-10" />
        ) : recentNotes.length === 0 ? (
          // Empty State
          <View className="items-center justify-center py-10 bg-muted/20 rounded-2xl border-dashed border border-border">
            <Brain
              size={40}
              className="text-muted-foreground mb-3 opacity-50"
            />
            <Text className="text-muted-foreground font-medium">
              No study sessions yet.
            </Text>
            <Text className="text-muted-foreground text-xs text-center mt-1 px-10">
              Go to the AI Studio tab to create your first summary or quiz!
            </Text>
          </View>
        ) : (
          // List of Recent Items
          <View className="gap-3 pb-20">
            {recentNotes.map((note) => (
              <TouchableOpacity
                key={note.id}
                onPress={() => router.push(`/note/${note.id}`)}
                className="bg-card p-4 rounded-xl border border-border flex-row items-center gap-4 shadow-sm"
              >
                <View
                  className={`w-12 h-12 rounded-xl items-center justify-center ${note.title.includes("Quiz") ? "bg-purple-100" : "bg-blue-100"}`}
                >
                  {note.title.includes("Quiz") ? (
                    <Brain size={20} className="text-purple-700" />
                  ) : (
                    <FileText size={20} className="text-blue-700" />
                  )}
                </View>

                <View className="flex-1">
                  <Text
                    className="font-bold text-foreground text-base"
                    numberOfLines={1}
                  >
                    {note.title}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Clock size={12} className="text-muted-foreground mr-1" />
                    <Text className="text-xs text-muted-foreground">
                      {formatDate(note.created_at)}
                    </Text>
                  </View>
                </View>

                <ChevronRight
                  size={18}
                  className="text-muted-foreground opacity-50"
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
