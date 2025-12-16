import { useState, useEffect } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus } from "lucide-react-native";
import { Button } from "../../components/ui/Button";
import { supabase } from "../../libs/supabase";
import { useAuth } from "../../providers/AuthProvider";
import { useNotification } from "../../providers/NotificationProvider";
import { ScheduleCard } from "../../components/planner/ScheduleCard";
import { EventModal } from "../../components/planner/EventModal";

export default function PlannerScreen() {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [schedule, setSchedule] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  useEffect(() => {
    if (user) fetchSchedule();
  }, [user]);

  async function fetchSchedule() {
    const { data } = await supabase
      .from("schedule")
      .select("*")
      .order("date")
      .order("start_time");
    if (data) setSchedule(data);
  }

  const openCreateModal = () => {
    setEditingItem(null);
    setModalVisible(true);
  };
  const openEditModal = (item: any) => {
    setEditingItem(item);
    setModalVisible(true);
  };

  const handleSave = async (eventData: any) => {
    if (!eventData.title.trim()) {
      showNotification("error", "Required", "Please enter a title.");
      return;
    }
    setLoading(true);
    const payload = { user_id: user?.id, ...eventData, type: "fixed" };

    const { error } = editingItem
      ? await supabase.from("schedule").update(payload).eq("id", editingItem.id)
      : await supabase.from("schedule").insert([payload]);

    if (error) showNotification("error", "Error", error.message);
    else {
      fetchSchedule();
      setModalVisible(false);
    }
    setLoading(false);
  };

  const handleDelete = () => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await supabase.from("schedule").delete().eq("id", editingItem.id);
          fetchSchedule();
          setModalVisible(false);
        },
      },
    ]);
  };

  const displayDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-1 p-4">
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
            <Plus size={24} color="#ffffff" />
          </Button>
        </View>

        <FlatList
          data={schedule}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <ScheduleCard
              item={item}
              onPress={openEditModal}
              displayDate={displayDate}
            />
          )}
        />

        <EventModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSave}
          onDelete={handleDelete}
          initialData={editingItem}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
}
