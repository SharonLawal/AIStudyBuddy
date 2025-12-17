import { View, Text, TouchableOpacity } from "react-native";
import { Card, CardContent } from "../ui/Card";
import { Save, X } from "lucide-react-native";
import Markdown from 'react-native-marked';

interface SummaryResultProps {
  summary: string;
  onSave: () => void;
  onClose: () => void;
}

export function SummaryResult({ summary, onSave, onClose }: SummaryResultProps) {
  return (
    <Card className="bg-card border border-primary/20 shadow-sm mb-10">
      <CardContent className="p-5">
        <View className="flex-row justify-between items-center mb-4 border-b border-border/50 pb-2">
          <Text className="font-bold text-xl text-primary">✨ Key Takeaways</Text>
          <View className="flex-row gap-2">
            <TouchableOpacity onPress={onSave} className="bg-green-100 p-2 rounded-full">
              <Save size={20} className="text-green-700" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <X size={20} className="text-muted-foreground" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-2">
          <Markdown 
            value={summary}
            flatListProps={{ 
              initialNumToRender: 8, 
              scrollEnabled: false,
              nestedScrollEnabled: false 
            }}
            theme={{ 
              colors: { 
                text: '#1f2937', 
                background: 'transparent', 
                code: '#f3f4f6', 
                link: '#7c3aed', 
                border: '#e5e7eb' 
              } 
            }}
          />
        </View>
      </CardContent>
    </Card>
  );
}