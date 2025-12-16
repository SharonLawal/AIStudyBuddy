import { View, TouchableOpacity } from "react-native";
import { Plus, Check, X } from "lucide-react-native";
import { Input } from "../ui/Input";

interface TaskInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

export function TaskInput({
  value,
  onChangeText,
  onSubmit,
  onCancel,
  isEditing,
}: TaskInputProps) {
  return (
    <View className="flex-row gap-3 items-center bg-card p-1 pr-2 rounded-3xl border border-border shadow-sm dark:shadow-none dark:bg-muted/40">
      <Input
        className="flex-1 bg-transparent border-0 h-12"
        placeholder={isEditing ? "Edit task..." : "Add a new task..."}
        value={value}
        onChangeText={onChangeText}
      />
      {isEditing ? (
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={onSubmit}
            className="w-10 h-10 bg-green-500 rounded-full items-center justify-center"
          >
            <Check size={18} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onCancel}
            className="w-10 h-10 bg-red-500 rounded-full items-center justify-center"
          >
            <X size={18} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={onSubmit}
          className="w-10 h-10 bg-primary rounded-full items-center justify-center shadow-sm"
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}
