import { View, Text } from "react-native";
import { Clock, CheckCircle2, Flame } from "lucide-react-native";
import { Card, CardContent } from "../ui/Card";

interface StatProps {
  icon: any;
  value: string | number;
  label: string;
  iconColor: string;
  bg: string;
}

function StatItem({ icon: Icon, value, label, iconColor, bg }: StatProps) {
  return (
    <Card className="flex-1 bg-card">
      <CardContent className="p-3 items-center justify-center">
        <View className={`w-10 h-10 rounded-full ${bg} items-center justify-center mb-2`}>
          <Icon size={20} className={iconColor} />
        </View>
        <Text className="text-lg font-bold text-foreground">{value}</Text>
        <Text className="text-xs text-muted-foreground">{label}</Text>
      </CardContent>
    </Card>
  );
}

export function StatsOverview() {
  return (
    <View className="flex-row gap-3">
      <StatItem icon={Clock} value="2h 15m" label="Focus" iconColor="text-primary" bg="bg-primary/10" />
      <StatItem icon={CheckCircle2} value="7" label="Done" iconColor="text-secondary" bg="bg-secondary/20" />
      <StatItem icon={Flame} value="12" label="Streak" iconColor="text-destructive" bg="bg-destructive/20" />
    </View>
  );
}