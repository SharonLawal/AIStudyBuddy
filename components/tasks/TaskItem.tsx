import { Text, TouchableOpacity } from "react-native";
import { Card, CardContent } from "../ui/Card";
import { Check, Square, Trash2 } from "lucide-react-native";
import { Task } from "../../types";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <Card className={`mb-2 ${task.completed ? "opacity-60" : ""}`}>
      <CardContent className="p-3 flex-row items-center gap-3">
        <TouchableOpacity 
          onPress={() => onToggle(task.id, task.completed)}
          accessibilityLabel={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed ? (
            <Check size={20} className="text-primary" />
          ) : (
            <Square size={20} className="text-muted-foreground" />
          )}
        </TouchableOpacity>
        
        <Text className={`flex-1 text-base ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
          {task.text}
        </Text>
        
        <TouchableOpacity 
          onPress={() => onDelete(task.id)}
          accessibilityLabel="Delete task"
        >
          <Trash2 size={18} className="text-destructive" />
        </TouchableOpacity>
      </CardContent>
    </Card>
  );
}