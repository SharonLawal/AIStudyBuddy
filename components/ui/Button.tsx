import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { cn } from "../../libs/utils";

interface ButtonProps extends TouchableOpacityProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function Button({ className, variant = "default", size = "default", children, ...props }: ButtonProps) {
  // Styles for text content
  const textClass = cn(
    "text-sm font-medium",
    variant === "default" && "text-primary-foreground",
    variant === "destructive" && "text-destructive-foreground",
    variant === "outline" && "text-foreground",
    variant === "secondary" && "text-secondary-foreground",
    variant === "ghost" && "text-foreground",
    variant === "link" && "text-primary"
  );

  return (
    <TouchableOpacity
      className={cn(
        "flex-row items-center justify-center rounded-md",
        // Background Colors
        variant === "default" && "bg-primary",
        variant === "destructive" && "bg-destructive",
        variant === "outline" && "border border-input bg-background",
        variant === "secondary" && "bg-secondary",
        variant === "ghost" && "hover:bg-accent",
        // Sizes
        size === "default" && "h-10 px-4 py-2",
        size === "sm" && "h-9 rounded-md px-3",
        size === "lg" && "h-11 rounded-md px-8",
        size === "icon" && "h-10 w-10",
        className
      )}
      activeOpacity={0.7}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return <Text className={textClass}>{child}</Text>;
        }
        return child;
      })}
    </TouchableOpacity>
  );
}