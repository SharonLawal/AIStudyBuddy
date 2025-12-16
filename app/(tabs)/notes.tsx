import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TaskItem } from "../../components/tasks/TaskItem";
import { TaskInput } from "../../components/tasks/TaskInput";
import { AIStudio } from "../../components/ai/AIStudio";
import { useTasks } from "../../hooks/useTasks";
import { Task } from "../../types";

export default function NotesScreen() {
  const [viewMode, setViewMode] = useState<"tasks" | "assistant">("tasks");
  const [taskText, setTaskText] = useState("");
  const { tasks, addTask, toggleTask, updateTask, deleteTask } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleSubmit = async () => {
    if (!taskText.trim()) return;
    if (editingTask) {
      await updateTask(editingTask.id, taskText);
      setEditingTask(null);
    } else {
      addTask(taskText);
    }
    setTaskText("");
    Keyboard.dismiss();
  };

  const startEditing = (task: Task) => {
    setEditingTask(task);
    setTaskText(task.text);
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setTaskText("");
    Keyboard.dismiss();
  };

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
          <View className="flex-1 gap-4">
            <TaskInput
              value={taskText}
              onChangeText={setTaskText}
              onSubmit={handleSubmit}
              onCancel={cancelEditing}
              isEditing={!!editingTask}
            />
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
