import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../libs/supabase";
import { useAuth } from "../../providers/AuthProvider";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Plus } from "lucide-react-native";
import { TaskItem } from "../../components/tasks/TaskItem";
import { AIStudio } from "../../components/ai/AIStudio";

export default function NotesScreen() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"tasks" | "ai-studio">("tasks");
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [user]);

  async function fetchTasks() {
    if (!user) return;
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setTasks(data);
  }

  async function addTask() {
    if (!newTask.trim() || !user) return;
    
    const { data } = await supabase
      .from('tasks')
      .insert([{ user_id: user.id, text: newTask, priority: 'medium' }])
      .select();

    if (data) setTasks([data[0], ...tasks]);
    setNewTask("");
  }

  async function toggleTask(id: string, currentStatus: boolean) {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
    await supabase.from('tasks').update({ completed: !currentStatus }).eq('id', id);
  }

  async function deleteTask(id: string) {
    setTasks(tasks.filter(t => t.id !== id));
    await supabase.from('tasks').delete().eq('id', id);
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1 p-4 gap-4">
        {/* Header */}
        <View>
          <Text className="text-2xl font-bold text-foreground">Study Hub</Text>
          <Text className="text-muted-foreground text-sm">Manage tasks & generate insights</Text>
        </View>

        {/* Tab Switcher */}
        <View className="flex-row p-1 bg-muted rounded-lg">
          <TabButton 
            label="Tasks" 
            isActive={viewMode === "tasks"} 
            onPress={() => setViewMode("tasks")} 
          />
          <TabButton 
            label="AI Studio" 
            isActive={viewMode === "ai-studio"} 
            onPress={() => setViewMode("ai-studio")} 
          />
        </View>

        {viewMode === "tasks" ? (
          <View className="flex-1 gap-3">
            <View className="flex-row gap-2">
              <Input 
                className="flex-1 bg-card" 
                placeholder="Add a new task..." 
                value={newTask} 
                onChangeText={setNewTask} 
              />
              <Button size="icon" onPress={addTask}>
                <Plus size={20} className="text-primary-foreground" />
              </Button>
            </View>

            <FlatList
              data={tasks}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingBottom: 100 }}
              renderItem={({ item }) => (
                <TaskItem 
                  task={item} 
                  onToggle={toggleTask} 
                  onDelete={deleteTask} 
                />
              )}
            />
          </View>
        ) : (
          <AIStudio />
        )}
      </View>
    </SafeAreaView>
  );
}

// Small helper component for the tabs
function TabButton({ label, isActive, onPress }: { label: string, isActive: boolean, onPress: () => void }) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`flex-1 py-2 rounded-md items-center ${isActive ? "bg-card" : ""}`}
    >
      <Text className={`font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}