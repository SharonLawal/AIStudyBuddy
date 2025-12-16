import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import {
  Plus,
  X,
  BookOpen,
  GraduationCap,
  Coffee,
  Dumbbell,
  Clock,
  Calendar,
} from "lucide-react-native";
import { supabase } from "../../libs/supabase";
import { useAuth } from "../../providers/AuthProvider";

const categoryConfig: any = {
  class: {
    icon: GraduationCap,
    colorHex: "#9333ea",
    bg: "bg-purple-100 dark:bg-purple-900/30",
    label: "Class",
  },
  study: {
    icon: BookOpen,
    colorHex: "#2563eb",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    label: "Study",
  },
  break: {
    icon: Coffee,
    colorHex: "#ea580c",
    bg: "bg-orange-100 dark:bg-orange-900/30",
    label: "Break",
  },
  activity: {
    icon: Dumbbell,
    colorHex: "#16a34a",
    bg: "bg-green-100 dark:bg-green-900/30",
    label: "Activity",
  },
};

export default function PlannerScreen() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("study");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(
    new Date(new Date().setHours(new Date().getHours() + 1))
  );
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [eventDate, setEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    if (user) fetchSchedule();
  }, [user]);

  async function fetchSchedule() {
    const { data } = await supabase
      .from("schedule")
      .select("*")
      .order("date", { ascending: true }) // Order by date first
      .order("start_time", { ascending: true });

    if (data) setSchedule(data);
  }

  // Format Date "YYYY-MM-DD"
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  // Format Date for Display "Mon, Oct 2"
  const displayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Parse "HH:MM AM/PM" back to Date object for editing
  const parseTimeStr = (timeStr: string) => {
    const d = new Date();
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    let h = parseInt(hours);
    if (modifier === "PM" && h < 12) h += 12;
    if (modifier === "AM" && h === 12) h = 0;
    d.setHours(h, parseInt(minutes));
    return d;
  };

  // Open modal for Creating
  const openCreateModal = () => {
    setEditingId(null);
    setTitle("");
    setCategory("study");
    setStartTime(new Date());
    setEndTime(new Date(new Date().setHours(new Date().getHours() + 1)));
    setModalVisible(true);
  };

  // Open modal for Editing
  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setStartTime(parseTimeStr(item.start_time));
    setEndTime(parseTimeStr(item.end_time));
    setModalVisible(true);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert("Required", "Please enter a title.");
      return;
    }
    setLoading(true);

    const eventData = {
      user_id: user?.id,
      title,
      start_time: formatTime(startTime),
      end_time: formatTime(endTime),
      category,
      type: "fixed",
    };

    let error;
    if (editingId) {
      // Update existing
      const { error: updateError } = await supabase
        .from("schedule")
        .update(eventData)
        .eq("id", editingId);
      error = updateError;
    } else {
      // Insert new
      const { error: insertError } = await supabase
        .from("schedule")
        .insert([eventData]);
      error = insertError;
    }

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      fetchSchedule(); // Refresh list
      setModalVisible(false);
    }
    setLoading(false);
  }

  const deleteItem = async () => {
    if (!editingId) return;
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await supabase.from("schedule").delete().eq("id", editingId);
          fetchSchedule();
          setModalVisible(false);
        },
      },
    ]);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selectedDate) setEventDate(selectedDate);
  };

  const onTimeChange = (
    event: any,
    selectedDate?: Date,
    type?: "start" | "end"
  ) => {
    if (Platform.OS === "android") {
      if (type === "start") setShowStartPicker(false);
      else setShowEndPicker(false);
    }
    if (selectedDate) {
      if (type === "start") setStartTime(selectedDate);
      else setEndTime(selectedDate);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-1 p-4">
        {/* Header */}
        <View className="mb-6 flex-row justify-between items-center">
          <View>
            <Text className="text-3xl font-bold text-foreground">Planner</Text>
            <Text className="text-muted-foreground">Design your day</Text>
          </View>
          <Button
            size="icon"
            className="rounded-full h-12 w-12 bg-primary shadow-lg"
            onPress={openCreateModal}
          >
            <Plus size={24} className="text-white" />
          </Button>
        </View>

        <FlatList
          data={schedule}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => {
            const config =
              categoryConfig[item.category] || categoryConfig.study;
            const Icon = config.icon;

            return (
              <TouchableOpacity onPress={() => openEditModal(item)}>
                <Card className="mb-3 border border-border shadow-sm bg-card dark:border-white/10">
                  <CardContent className="p-4 flex-row items-center gap-4">
                    <View className="items-center justify-center w-14">
                      <Text className="font-bold text-foreground">
                        {item.start_time}
                      </Text>

                      <View className="h-8 w-[2px] bg-border my-1 rounded-full dark:bg-white/10" />
                      <Text className="text-xs text-muted-foreground">
                        {item.end_time}
                      </Text>
                    </View>
                    <View className={`p-3 rounded-2xl ${config.bg}`}>
                      <Icon size={20} color={config.colorHex} />
                    </View>
                    <View className="flex-1">
                      <Text className="font-bold text-lg text-foreground">
                        {item.title}
                      </Text>
                      <View className="flex-row items-center gap-2">
                        {item.date && (
                          <View className="bg-muted px-2 py-0.5 rounded-md">
                            <Text className="text-[10px] text-muted-foreground font-medium">
                              {displayDate(item.date)}
                            </Text>
                          </View>
                        )}
                        <Text className="text-xs text-muted-foreground capitalize">
                          {item.category}
                        </Text>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              </TouchableOpacity>
            );
          }}
        />

        {/* Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-end bg-black/60">
            {/* ✅ Modal Content Styled for Dark Mode */}
            <View className="bg-background p-6 rounded-t-[32px] gap-6 shadow-2xl pb-10 border-t border-white/10">
              <View className="flex-row justify-between items-center border-b border-border pb-4 dark:border-white/10">
                <Text className="text-xl font-bold text-foreground">
                  {editingId ? "Edit Event" : "New Event"}
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="p-2 bg-muted rounded-full"
                >
                  {/* ✅ Close Icon handles Dark Mode */}
                  <X size={20} color={isDark ? "#ffffff" : "#0f172a"} />
                </TouchableOpacity>
              </View>

              <View className="gap-2">
                <Text className="font-medium text-foreground ml-1">Title</Text>
                <Input
                  placeholder="E.g. Math Exam"
                  value={title}
                  onChangeText={setTitle}
                  className="bg-muted/30 border border-border h-12 rounded-2xl dark:bg-muted/50"
                />
              </View>

              <View className="gap-2">
                <Text className="font-medium text-foreground ml-1">Date</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="flex-row items-center bg-muted/30 border border-border h-12 px-4 rounded-2xl dark:bg-muted/50"
                >
                  {/* ✅ Calendar Icon handles Dark Mode */}
                  <Calendar
                    size={18}
                    color={isDark ? "#a1a1aa" : "#7c3aed"}
                    style={{ marginRight: 8 }}
                  />
                  <Text className="text-foreground font-medium">
                    {eventDate.toDateString()}
                  </Text>
                </TouchableOpacity>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={eventDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              )}

              <View className="flex-row gap-4">
                <View className="flex-1 gap-2">
                  <Text className="font-medium text-foreground ml-1">
                    Start Time
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowStartPicker(true)}
                    className="flex-row items-center bg-muted/30 border border-border h-12 px-4 rounded-2xl dark:bg-muted/50"
                  >
                    {/* ✅ Clock Icon handles Dark Mode */}
                    <Clock
                      size={18}
                      color={isDark ? "#a1a1aa" : "#7c3aed"}
                      style={{ marginRight: 8 }}
                    />
                    <Text className="text-foreground font-medium">
                      {formatTime(startTime)}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-1 gap-2">
                  <Text className="font-medium text-foreground ml-1">
                    End Time
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowEndPicker(true)}
                    className="flex-row items-center bg-muted/30 border border-border h-12 px-4 rounded-2xl dark:bg-muted/50"
                  >
                    <Clock
                      size={18}
                      color={isDark ? "#a1a1aa" : "#7c3aed"}
                      style={{ marginRight: 8 }}
                    />
                    <Text className="text-foreground font-medium">
                      {formatTime(endTime)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {showStartPicker && (
                <DateTimePicker
                  value={startTime}
                  mode="time"
                  display="spinner"
                  onChange={(e, d) => onTimeChange(e, d, "start")}
                />
              )}
              {showEndPicker && (
                <DateTimePicker
                  value={endTime}
                  mode="time"
                  display="spinner"
                  onChange={(e, d) => onTimeChange(e, d, "end")}
                />
              )}

              <View className="gap-2">
                <Text className="font-medium text-foreground ml-1">
                  Category
                </Text>
                <View className="flex-row justify-between">
                  {Object.entries(categoryConfig).map(([key, config]: any) => (
                    <TouchableOpacity
                      key={key}
                      onPress={() => setCategory(key)}
                      className={`items-center justify-center w-20 h-20 rounded-2xl border-2 ${
                        category === key
                          ? "border-primary bg-primary/10"
                          : "border-transparent bg-muted/30 dark:bg-muted/50"
                      }`}
                    >
                      {/* ✅ Category Icons handle Dark Mode */}
                      <config.icon
                        size={24}
                        color={
                          category === key
                            ? "#7c3aed"
                            : isDark
                              ? "#a1a1aa"
                              : "#64748b"
                        }
                      />
                      <Text
                        className={`text-xs mt-1 ${
                          category === key
                            ? "text-primary font-bold"
                            : "text-muted-foreground"
                        }`}
                      >
                        {config.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="flex-row gap-3 mt-4">
                {editingId && (
                  <Button
                    variant="destructive"
                    onPress={deleteItem}
                    className="flex-1 h-14 rounded-2xl"
                  >
                    <Text className="text-white font-bold">Delete</Text>
                  </Button>
                )}
                <Button
                  onPress={handleSave}
                  className="flex-[2] h-14 rounded-2xl bg-primary shadow-lg shadow-primary/25"
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white font-bold text-lg">
                      {editingId ? "Update" : "Create Event"}
                    </Text>
                  )}
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
