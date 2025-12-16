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
          <View className="flex-1 gap-3">
            <View className="flex-row gap-2 items-center">
              <Input
                className={`flex-1 bg-card ${editingTask ? "border-primary border" : ""}`}
                placeholder={editingTask ? "Edit task..." : "Add a new task..."}
                value={taskText}
                onChangeText={setTaskText}
              />

              {editingTask ? (
                <View className="flex-row gap-1">
                  <Button
                    size="icon"
                    onPress={handleSubmit}
                    className="bg-green-600"
                  >
                    <Check size={20} className="text-white" />
                  </Button>
                  <Button
                    size="icon"
                    onPress={cancelEditing}
                    variant="destructive"
                  >
                    <X size={20} className="text-white" />
                  </Button>
                </View>
              ) : (
                <Button size="icon" onPress={handleSubmit}>
                  <Plus size={20} className="text-primary-foreground" />
                </Button>
              )}
            </View>

            {/* Task List */}
            <FlatList
              data={tasks}
              keyExtractor={(i) => i.id}
              contentContainerStyle={{ paddingBottom: 100 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onLongPress={() => startEditing(item)}
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
