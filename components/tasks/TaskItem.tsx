import { Text, TouchableOpacity, View } from "react-native";
import { Check, Square, Trash2 } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Task } from "../../types";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      className={`mb-3 p-4 rounded-2xl flex-row items-center gap-4 border ${
        task.completed 
          ? "bg-muted/30 border-transparent" 
          : "bg-card border-border dark:bg-card/50 dark:border-white/10"
      }`}
    >
      <TouchableOpacity
        onPress={() => onToggle(task.id, task.completed)}
        className="p-1"
        accessibilityLabel={task.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {task.completed ? (
          <View className="bg-primary/20 rounded-md p-0.5">
            <Check size={18} color="#7c3aed" strokeWidth={3} />
          </View>
        ) : (
          <Square 
            size={22} 
            color={isDark ? "#94a3b8" : "#64748b"}
            strokeWidth={2}
          />
        )}
      </TouchableOpacity>

      <Text
        className={`flex-1 text-base font-medium ${
          task.completed 
            ? "line-through text-muted-foreground" 
            : "text-foreground"
        }`}
      >
        {task.text}
      </Text>

      <TouchableOpacity
        onPress={() => onDelete(task.id)}
        className="opacity-70 p-1"
        accessibilityLabel="Delete task"
      >
        <Trash2 
          size={18} 
          color={isDark ? "#ef4444" : "#dc2626"}
        />
      </TouchableOpacity>
    </View>
  );
}