import { TextInput, TextInputProps } from "react-native";
import { cn } from "../../libs/utils";

export function Input({ className, ...props }: TextInputProps) {
  return (
    <TextInput
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      placeholderTextColor="#9ca3af"
      {...props}
    />
  );
}

