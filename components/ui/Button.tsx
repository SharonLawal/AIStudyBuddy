import { TouchableOpacity, Text } from "react-native";
import { styled } from "nativewind";

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

export function Button({
  onPress,
  variant = "default",
  size = "default",
  className,
  children,
  disabled,
}: {
  onPress?: () => void;
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const baseStyles = "flex-row items-center justify-center rounded-lg";

  const variants = {
    default: "bg-indigo-600",
    destructive: "bg-red-500",
    outline: "border border-slate-700 bg-transparent",
    secondary: "bg-teal-400",
    ghost: "bg-transparent",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  const textColors = {
    default: "text-white",
    destructive: "text-white",
    outline: "text-slate-100",
    secondary: "text-slate-900",
    ghost: "text-slate-100",
  };

  return (
    <StyledTouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        disabled ? "opacity-50" : ""
      } ${className}`}
    >
      <StyledText className={`font-medium ${textColors[variant]}`}>
        {children}
      </StyledText>
    </StyledTouchableOpacity>
  );
}
