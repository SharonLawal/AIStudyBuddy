import { TextInput, TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
  className?: string;
  icon?: React.ReactNode;
}

export function Input({ className, icon, ...props }: InputProps) {
  return (
    <View
      className={`flex-row items-center bg-muted/50 rounded-2xl border border-transparent focus:border-primary h-14 px-4 dark:bg-muted dark:border-white/5 ${className}`}
    >
      {icon && <View className="mr-3 opacity-70">{icon}</View>}
      <TextInput
        placeholderTextColor="#94a3b8"
        className="flex-1 text-foreground text-base h-full font-medium"
        {...props}
      />
    </View>
  );
}