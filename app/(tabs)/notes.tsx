import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Plus, Check, X } from "lucide-react-native";
import { TaskItem } from "../../components/tasks/TaskItem";
import { AIStudio } from "../../components/ai/AIStudio";
import { useTasks } from "../../hooks/useTasks";
import { Task } from "../../types";

export default function NotesScreen() {
  const [viewMode, setViewMode] = useState<"tasks" | "assistant">("tasks");
  const [taskText, setTaskText] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null); // Track what we are editing

  const { tasks, addTask, toggleTask, updateTask, deleteTask } = useTasks();

  const handleSubmit = async () => {
    if (!taskText.trim()) return;

    if (editingTask) {
      // ✅ Update existing task
      await updateTask(editingTask.id, taskText);
      setEditingTask(null);
    } else {
      // ✅ Create new task
      addTask(taskText);
    }
    setTaskText("");
    Keyboard.dismiss();
  };

  const startEditing = (task: Task) => {
    setEditingTask(task);
    setTaskText(task.text); // Pre-fill input
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setTaskText("");
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-1 p-4 gap-4">
        {/* Header */}
        <View>
          <Text className="text-2xl font-bold text-foreground">Study Hub</Text>
          <Text className="text-muted-foreground text-sm">
            Manage tasks & get help
          </Text>
        </View>

        {/* Tab Switcher */}
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
          <View className="flex-1 gap-4">
            {/* Input Bar */}
            <View className="flex-row gap-3 items-center bg-card p-1 pr-2 rounded-3xl border border-border shadow-sm dark:shadow-none dark:bg-muted/40">
              <Input
                className="flex-1 bg-transparent border-0 h-12" // Transparent to blend with container
                placeholder={editingTask ? "Edit task..." : "Add a new task..."}
                value={taskText}
                onChangeText={setTaskText}
              />

              {editingTask ? (
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={handleSubmit}
                    className="w-10 h-10 bg-green-500 rounded-full items-center justify-center"
                  >
                    <Check size={18} className="text-white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={cancelEditing}
                    className="w-10 h-10 bg-red-500 rounded-full items-center justify-center"
                  >
                    <X size={18} className="text-white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleSubmit}
                  className="w-10 h-10 bg-primary rounded-full items-center justify-center shadow-sm"
                >
                  <Plus size={20} className="text-white" />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={tasks}
              keyExtractor={(i) => i.id}
              contentContainerStyle={{ paddingBottom: 100 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => startEditing(item)}
                  activeOpacity={0.7}
                >
                  <TaskItem
                    task={item}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                  />
                </TouchableOpacity>
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
