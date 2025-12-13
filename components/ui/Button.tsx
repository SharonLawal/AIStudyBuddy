import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function Button({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: ButtonProps) {
  const variants = {
    default: "bg-primary",
    destructive: "bg-destructive",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  const textColors = {
    default: "text-primary-foreground",
    destructive: "text-destructive-foreground",
    outline: "text-foreground",
    secondary: "text-secondary-foreground",
    ghost: "text-foreground",
    link: "text-primary",
  };

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {typeof children === "string" ? (
        <Text className={`font-medium ${textColors[variant]}`}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
