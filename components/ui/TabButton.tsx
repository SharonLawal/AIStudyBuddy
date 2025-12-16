import { Text, TouchableOpacity } from "react-native";

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export function TabButton({ label, isActive, onPress }: TabButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 py-2 rounded-md items-center ${isActive ? "bg-card shadow-sm" : ""}`}
    >
      <Text
        className={`font-medium text-sm ${isActive ? "text-foreground" : "text-muted-foreground"}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
