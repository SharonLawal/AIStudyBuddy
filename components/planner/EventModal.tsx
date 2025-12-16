import { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useColorScheme } from "nativewind";
import {
  X,
  Calendar,
  Clock,
  BookOpen,
  GraduationCap,
  Coffee,
  Dumbbell,
} from "lucide-react-native";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const categoryConfig: any = {
  class: { icon: GraduationCap, colorHex: "#9333ea", label: "Class" },
  study: { icon: BookOpen, colorHex: "#2563eb", label: "Study" },
  break: { icon: Coffee, colorHex: "#ea580c", label: "Break" },
  activity: { icon: Dumbbell, colorHex: "#16a34a", label: "Activity" },
};

interface EventModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete: () => void;
  initialData?: any;
  loading: boolean;
}

export function EventModal({
  visible,
  onClose,
  onSave,
  onDelete,
  initialData,
  loading,
}: EventModalProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("study");
  const [eventDate, setEventDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(
    new Date(new Date().setHours(new Date().getHours() + 1))
  );

  // Picker visibility
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Load data when modal opens
  useEffect(() => {
    if (visible) {
      if (initialData) {
        setTitle(initialData.title);
        setCategory(initialData.category);
        setEventDate(new Date(initialData.date));
        setStartTime(parseTimeStr(initialData.start_time));
        setEndTime(parseTimeStr(initialData.end_time));
      } else {
        resetForm();
      }
    }
  }, [visible, initialData]);

  const resetForm = () => {
    setTitle("");
    setCategory("study");
    setEventDate(new Date());
    setStartTime(new Date());
    setEndTime(new Date(new Date().setHours(new Date().getHours() + 1)));
  };

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

  const handleSave = () => {
    onSave({
      title,
      category,
      date: eventDate.toISOString().split("T")[0],
      start_time: startTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      end_time: endTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    });
  };

  const onDateChange = (e: any, d?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (d) setEventDate(d);
  };
  const onStartChange = (e: any, d?: Date) => {
    if (Platform.OS === "android") setShowStartPicker(false);
    if (d) setStartTime(d);
  };
  const onEndChange = (e: any, d?: Date) => {
    if (Platform.OS === "android") setShowEndPicker(false);
    if (d) setEndTime(d);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/60">
        <View className="bg-background p-6 rounded-t-[32px] gap-6 shadow-2xl pb-10 border-t border-white/10">
          {/* Header */}
          <View className="flex-row justify-between items-center border-b border-border pb-4 dark:border-white/10">
            <Text className="text-xl font-bold text-foreground">
              {initialData ? "Edit Event" : "New Event"}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="p-2 bg-muted rounded-full"
            >
              <X size={20} color={isDark ? "#ffffff" : "#0f172a"} />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View className="gap-2">
            <Text className="font-medium text-foreground ml-1">Title</Text>
            <Input
              placeholder="E.g. Math Exam"
              value={title}
              onChangeText={setTitle}
              className="bg-muted/30 border border-border h-12 rounded-2xl dark:bg-muted/50"
            />
          </View>

          {/* Date */}
          <View className="gap-2">
            <Text className="font-medium text-foreground ml-1">Date</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="flex-row items-center bg-muted/30 border border-border h-12 px-4 rounded-2xl dark:bg-muted/50"
            >
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

          {/* Times */}
          <View className="flex-row gap-4">
            <View className="flex-1 gap-2">
              <Text className="font-medium text-foreground ml-1">Start</Text>
              <TouchableOpacity
                onPress={() => setShowStartPicker(true)}
                className="flex-row items-center bg-muted/30 border border-border h-12 px-4 rounded-2xl dark:bg-muted/50"
              >
                <Clock
                  size={18}
                  color={isDark ? "#a1a1aa" : "#7c3aed"}
                  style={{ marginRight: 8 }}
                />
                <Text className="text-foreground font-medium">
                  {startTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-1 gap-2">
              <Text className="font-medium text-foreground ml-1">End</Text>
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
                  {endTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {showStartPicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              display="spinner"
              onChange={onStartChange}
            />
          )}
          {showEndPicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              display="spinner"
              onChange={onEndChange}
            />
          )}

          {/* Categories */}
          <View className="gap-2">
            <Text className="font-medium text-foreground ml-1">Category</Text>
            <View className="flex-row justify-between">
              {Object.entries(categoryConfig).map(([key, config]: any) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => setCategory(key)}
                  className={`items-center justify-center w-20 h-20 rounded-2xl border-2 ${category === key ? "border-primary bg-primary/10" : "border-transparent bg-muted/30 dark:bg-muted/50"}`}
                >
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
                    className={`text-xs mt-1 ${category === key ? "text-primary font-bold" : "text-muted-foreground"}`}
                  >
                    {config.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Actions */}
          <View className="flex-row gap-3 mt-4">
            {initialData && (
              <Button
                variant="destructive"
                onPress={onDelete}
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
                  {initialData ? "Update" : "Create Event"}
                </Text>
              )}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
