import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckSquare, Trash2, Plus } from "lucide-react-native";
import { Input } from "@/components/ui/Input";

const mockTasks = [
  { id: "1", text: "Review Bio Notes", priority: "high", completed: false },
  { id: "2", text: "Math Homework", priority: "medium", completed: true },
  { id: "3", text: "Email Professor", priority: "low", completed: false },
];

export default function Notes() {
  const [mode, setMode] = useState<"tasks" | "notes">("tasks");
  const [tasks, setTasks] = useState(mockTasks);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask) return;
    setTasks([
      ...tasks,
      {
        id: Date.now().toString(),
        text: newTask,
        priority: "medium",
        completed: false,
      },
    ]);
    setNewTask("");
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950 p-4">
      {/* Toggle */}
      <View className="flex-row bg-slate-900 p-1 rounded-lg mb-6">
        <TouchableOpacity
          onPress={() => setMode("tasks")}
          className={`flex-1 py-2 items-center rounded-md ${
            mode === "tasks" ? "bg-indigo-600" : ""
          }`}
        >
          <Text className="text-white font-bold">Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMode("notes")}
          className={`flex-1 py-2 items-center rounded-md ${
            mode === "notes" ? "bg-indigo-600" : ""
          }`}
        >
          <Text className="text-white font-bold">Notes</Text>
        </TouchableOpacity>
      </View>

      {mode === "tasks" ? (
        <View className="flex-1">
          <View className="flex-row gap-2 mb-4">
            <Input
              value={newTask}
              onChangeText={setNewTask}
              placeholder="Add new task..."
              className="flex-1"
            />
            <TouchableOpacity
              onPress={addTask}
              className="bg-teal-400 w-10 h-10 items-center justify-center rounded-md"
            >
              <Plus color="#0f172a" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="bg-slate-900 p-4 rounded-xl mb-3 flex-row items-center gap-3">
                <TouchableOpacity
                  onPress={() => {
                    setTasks(
                      tasks.map((t) =>
                        t.id === item.id ? { ...t, completed: !t.completed } : t
                      )
                    );
                  }}
                >
                  <View
                    className={`w-5 h-5 border rounded ${
                      item.completed
                        ? "bg-indigo-500 border-indigo-500"
                        : "border-slate-500"
                    }`}
                  >
                    {item.completed && <CheckSquare size={18} color="white" />}
                  </View>
                </TouchableOpacity>

                <Text
                  className={`flex-1 text-white ${
                    item.completed ? "line-through text-slate-500" : ""
                  }`}
                >
                  {item.text}
                </Text>

                <View
                  className={`px-2 py-1 rounded text-xs ${
                    item.priority === "high"
                      ? "bg-red-900/50"
                      : "bg-blue-900/50"
                  }`}
                >
                  <Text className="text-white text-[10px] uppercase">
                    {item.priority}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      ) : (
        <View className="flex-1 bg-slate-900 rounded-xl p-4">
          <TextInput
            multiline
            placeholder="Start typing notes..."
            placeholderTextColor="#64748b"
            className="text-white flex-1 text-base leading-6"
            textAlignVertical="top"
          />
        </View>
      )}
    </SafeAreaView>
  );
}
