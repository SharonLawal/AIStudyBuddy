import { View, Text, ViewProps, TextProps } from "react-native";

export function Card({ className, ...props }: ViewProps) {
  return (
    <View
      className={`bg-card rounded-xl border border-border shadow-sm ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ViewProps) {
  return <View className={`p-6 pb-2 ${className}`} {...props} />;
}

export function CardTitle({ className, ...props }: TextProps) {
  return (
    <Text
      className={`text-lg font-semibold text-card-foreground leading-none ${className}`}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: TextProps) {
  return (
    <Text
      className={`text-sm text-muted-foreground mt-1 ${className}`}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: ViewProps) {
  return <View className={`p-6 pt-0 ${className}`} {...props} />;
}
