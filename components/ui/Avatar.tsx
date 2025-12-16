import { View, Text, Image } from "react-native";

export function Avatar({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <View
      className={`h-10 w-10 rounded-full overflow-hidden bg-muted justify-center items-center ${className}`}
    >
      {children}
    </View>
  );
}

export function AvatarImage({ src }: { src: any }) {
  return <Image source={src} className="h-full w-full" resizeMode="cover" />;
}

export function AvatarFallback({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View
      className={`h-full w-full justify-center items-center bg-muted ${className}`}
    >
      <Text className="text-muted-foreground font-medium">{children}</Text>
    </View>
  );
}
