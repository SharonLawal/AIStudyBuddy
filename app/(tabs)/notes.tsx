import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Plus } from "lucide-react-native";
import { useTasks } from "../../hooks/useTasks";
import { TaskItem } from "../../components/tasks/TaskItem";
import { AIStudio } from "../../components/ai/AIStudio";

export default function NotesScreen() {
  const [viewMode, setViewMode] = useState<"tasks" | "ai-studio">("tasks");
  const [newTask, setNewTask] = useState("");
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();

  const handleAddTask = () => {
    addTask(newTask);
    setNewTask("");
  };

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
              <Button size="icon" onPress={handleAddTask}>
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

// Small helper component
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