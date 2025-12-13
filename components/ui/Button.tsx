import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { cn } from "../../libs/utils"; // Ensure this path matches your utils file

interface ButtonProps extends TouchableOpacityProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function Button({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={cn(
        "flex-row items-center justify-center rounded-md ring-offset-background",
        // Variant Styles
        variant === "default" && "bg-primary",
        variant === "destructive" && "bg-destructive",
        variant === "outline" && "border border-input bg-background",
        variant === "secondary" && "bg-secondary",
        variant === "ghost" && "hover:bg-accent hover:text-accent-foreground",
        variant === "link" && "text-primary underline-offset-4 underline",
        // Size Styles
        size === "default" && "h-10 px-4 py-2",
        size === "sm" && "h-9 rounded-md px-3",
        size === "lg" && "h-11 rounded-md px-8",
        size === "icon" && "h-10 w-10",
        className
      )}
      activeOpacity={0.7}
      {...props}
    >
      {typeof children === "string" ? (
        <Text
          className={cn(
            "text-sm font-medium",
            variant === "default" && "text-primary-foreground",
            variant === "destructive" && "text-destructive-foreground",
            variant === "outline" && "text-foreground",
            variant === "secondary" && "text-secondary-foreground",
            variant === "ghost" && "text-foreground",
            variant === "link" && "text-primary"
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
