import { View, ViewProps, Text, TextProps } from "react-native";

export function Card({
  className,
  ...props
}: ViewProps & { className?: string }) {
  return (
    <View
      className={`bg-card rounded-3xl border border-border shadow-sm dark:shadow-none dark:border-white/10 ${className}`}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: ViewProps & { className?: string }) {
  return <View className={`p-5 ${className}`} {...props} />;
}

export function CardHeader({
  className,
  ...props
}: ViewProps & { className?: string }) {
  return (
    <View className={`flex-col space-y-1.5 p-6 ${className}`} {...props} />
  );
}

export function CardTitle({
  className,
  ...props
}: TextProps & { className?: string }) {
  return (
    <Text
      className={`text-2xl font-semibold leading-none tracking-tight text-card-foreground ${className}`}
      {...props}
    />
  );
}
