import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Coffee, Dumbbell } from 'lucide-react-native';

const schedule = [
  { id: 1, time: '09:00 - 10:00', title: 'Mathematics', type: 'fixed', icon: BookOpen },
  { id: 2, time: '10:15 - 11:00', title: 'Study: Calculus', type: 'ai', icon: BookOpen },
  { id: 3, time: '12:00 - 13:00', title: 'Lunch', type: 'fixed', icon: Coffee },
  { id: 4, time: '14:00 - 15:00', title: 'Gym', type: 'ai', icon: Dumbbell },
];

export default function Planner() {
  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      <Text className="text-2xl font-bold text-text mb-6">Today's Plan</Text>
      
      <ScrollView contentContainerClassName="gap-4">
        {schedule.map((item) => (
          <View 
            key={item.id} 
            className={`bg-card p-4 rounded-xl border-l-4 flex-row items-center gap-4 ${
              item.type === 'fixed' ? 'border-l-primary' : 'border-l-secondary border-dashed border'
            }`}
          >
            <View className={`p-2 rounded-lg ${item.type === 'fixed' ? 'bg-primary/20' : 'bg-secondary/20'}`}>
              <item.icon size={20} color={item.type === 'fixed' ? '#4f46e5' : '#2dd4bf'} />
            </View>
            <View className="flex-1">
              <Text className="text-text font-bold text-base">{item.title}</Text>
              <Text className="text-muted text-sm">{item.time}</Text>
            </View>
            {item.type === 'ai' && (
              <View className="bg-secondary/20 px-2 py-1 rounded">
                <Text className="text-secondary text-[10px] font-bold">AI</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}