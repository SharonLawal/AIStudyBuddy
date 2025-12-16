import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Plus } from "lucide-react-native";
import { TaskItem } from "../../components/tasks/TaskItem";
import { AIStudio } from "../../components/ai/AIStudio";
import { useTasks } from "../../hooks/useTasks";

export default function NotesScreen() {
  const [viewMode, setViewMode] = useState<"tasks" | "assistant">("tasks");
  const [newTask, setNewTask] = useState("");
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-1 p-4 gap-4">
        <View>
          <Text className="text-2xl font-bold text-foreground">Study Hub</Text>
          <Text className="text-muted-foreground text-sm">
            Manage tasks & get help
          </Text>
        </View>

        <View className="flex-row p-1 bg-muted rounded-lg">
          <TouchableOpacity
            onPress={() => setViewMode("tasks")}
            className={`flex-1 py-2 rounded-md items-center ${viewMode === "tasks" ? "bg-card" : ""}`}
          >
            <Text
              className={`font-medium ${viewMode === "tasks" ? "text-foreground" : "text-muted-foreground"}`}
            >
              Tasks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode("assistant")}
            className={`flex-1 py-2 rounded-md items-center ${viewMode === "assistant" ? "bg-card" : ""}`}
          >
            <Text
              className={`font-medium ${viewMode === "assistant" ? "text-foreground" : "text-muted-foreground"}`}
            >
              Smart Assistant
            </Text>
          </TouchableOpacity>
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
              <Button
                size="icon"
                onPress={() => {
                  addTask(newTask);
                  setNewTask("");
                }}
              >
                <Plus size={20} className="text-primary-foreground" />
              </Button>
            </View>
            <FlatList
              data={tasks}
              keyExtractor={(i) => i.id}
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
