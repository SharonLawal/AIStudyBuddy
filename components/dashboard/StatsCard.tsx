import { View, Text } from "react-native";
import { Card, CardContent } from "../ui/Card";

interface StatsCardProps {
  icon: any;
  value: string | number;
  label: string;
  iconColor: string;
  bg: string;
}

export function StatsCard({
  icon: Icon,
  value,
  label,
  iconColor,
  bg,
}: StatsCardProps) {
  return (
    <Card className="flex-1 bg-card">
      <CardContent className="p-3 items-center justify-center">
        <View
          className={`w-10 h-10 rounded-full ${bg} items-center justify-center mb-2`}
        >
          <Icon size={20} className={iconColor} />
        </View>
        <Text className="text-lg font-bold text-foreground">{value}</Text>
        <Text className="text-xs text-muted-foreground">{label}</Text>
      </CardContent>
    </Card>
  );
}
