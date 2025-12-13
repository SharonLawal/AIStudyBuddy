import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Sparkles, Plus, Trash2, Check, Square } from "lucide-react-native";

interface Task { id: string; text: string; completed: boolean; priority: "high" | "medium" | "low"; }

const mockTasks: Task[] = [
  { id: "1", text: "Review Chapter 4 - Biology", completed: false, priority: "high" },
  { id: "2", text: "Submit Math Assignment", completed: true, priority: "high" },
  { id: "3", text: "Read 20 pages of History", completed: false, priority: "medium" },
];

const priorityColors = {
  high: "bg-destructive/20 text-destructive",
  medium: "bg-yellow-500/20 text-yellow-600",
  low: "bg-secondary/20 text-secondary",
};

export default function NotesScreen() {
  const [viewMode, setViewMode] = useState<"tasks" | "notes">("tasks");
  const [tasks, setTasks] = useState(mockTasks);
  const [newTask, setNewTask] = useState("");
  const [noteContent, setNoteContent] = useState("Cell Biology Notes:\n- Mitochondria is the powerhouse...");

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), text: newTask, completed: false, priority: "medium" }]);
      setNewTask("");
    }
  };

  const toggleTask = (id: string) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTask = (id: string) => setTasks(tasks.filter(t => t.id !== id));

  return (
    <View className="flex-1 bg-background p-4 gap-4">
      <View>
        <Text className="text-2xl font-bold text-foreground">Notes & Tasks</Text>
        <Text className="text-muted-foreground text-sm">Stay organized, stay ahead</Text>
      </View>

      {/* Segmented Control */}
      <View className="flex-row p-1 bg-muted rounded-lg">
        {["tasks", "notes"].map((mode) => (
          <TouchableOpacity
            key={mode}
            onPress={() => setViewMode(mode as any)}
            className={`flex-1 py-2 rounded-md items-center ${viewMode === mode ? "bg-card shadow-sm" : ""}`}
          >
            <Text className={`text-sm font-medium ${viewMode === mode ? "text-foreground" : "text-muted-foreground"}`}>
              {mode === "tasks" ? "To-Do List" : "Quick Notes"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {viewMode === "tasks" ? (
        <View className="flex-1 gap-3">
          <View className="flex-row gap-2">
            <Input className="flex-1" placeholder="Add a new task..." value={newTask} onChangeText={setNewTask} />
            <Button size="icon" variant="secondary" onPress={addTask}>
              <Plus size={16} className="text-secondary-foreground" />
            </Button>
          </View>
          <FlatList
            data={tasks}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Card className={`mb-2 ${item.completed ? "opacity-60" : ""}`}>
                <CardContent className="p-3 flex-row items-center gap-3">
                  <TouchableOpacity onPress={() => toggleTask(item.id)}>
                    {item.completed ? <Check size={20} className="text-primary" /> : <Square size={20} className="text-muted-foreground" />}
                  </TouchableOpacity>
                  <Text className={`flex-1 text-sm ${item.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {item.text}
                  </Text>
                  <View className={`px-2 py-0.5 rounded-full ${priorityColors[item.priority]}`}>
                    <Text className="text-[10px] font-medium capitalize">{item.priority}</Text>
                  </View>
                  <TouchableOpacity onPress={() => deleteTask(item.id)}>
                    <Trash2 size={16} className="text-muted-foreground" />
                  </TouchableOpacity>
                </CardContent>
              </Card>
            )}
          />
        </View>
      ) : (
        <View className="flex-1 gap-3">
          <Card className="flex-1">
            <CardContent className="p-4 flex-1">
              <TextInput
                multiline
                className="flex-1 text-foreground text-base"
                value={noteContent}
                onChangeText={setNoteContent}
                textAlignVertical="top"
              />
            </CardContent>
          </Card>
          <View className="flex-row gap-2">
            <Button variant="outline" className="flex-1 flex-row gap-2">
              <Sparkles size={16} className="text-foreground" />
              <Text className="text-foreground font-medium">AI Summarize</Text>
            </Button>
            <Button variant="outline" className="flex-1 flex-row gap-2">
              <Brain size={16} className="text-foreground" />
              <Text className="text-foreground font-medium">Quiz Me</Text>
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}