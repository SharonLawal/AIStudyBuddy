import { View, Text, TouchableOpacity } from "react-native";
import { Card, CardContent } from "../ui/Card";
import { X } from "lucide-react-native";
import { QuizQuestion } from "../../types";

interface AIResultDisplayProps {
  result: string | QuizQuestion[];
  type: "summary" | "quiz";
  onClose: () => void;
}

export function AIResultDisplay({ result, type, onClose }: AIResultDisplayProps) {
  return (
    <Card className="bg-secondary/10 border-secondary/20 mt-4">
      <CardContent className="p-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="font-bold text-lg text-foreground">
            {type === 'summary' ? 'Summary' : 'Quiz Generated'}
          </Text>
          <TouchableOpacity onPress={onClose} accessibilityLabel="Close result">
            <X size={16} className="text-muted-foreground" />
          </TouchableOpacity>
        </View>

        {type === 'summary' ? (
          <Text className="text-foreground leading-6">
            {typeof result === 'string' ? result : "Invalid summary format"}
          </Text>
        ) : (
          <View className="gap-4">
            {Array.isArray(result) ? (
              result.map((q, i) => (
                <View key={i} className="gap-2 border-b border-border/50 pb-4">
                  <Text className="font-semibold text-foreground">{i + 1}. {q.question}</Text>
                  {q.options.map((opt, idx) => (
                    <View key={idx} className={`p-2 rounded-md ${idx === q.answer ? 'bg-green-500/20' : 'bg-muted'}`}>
                      <Text className={idx === q.answer ? 'text-green-700 font-medium' : 'text-foreground'}>
                        {opt} {idx === q.answer && "(Correct)"}
                      </Text>
                    </View>
                  ))}
                </View>
              ))
            ) : (
              <Text className="text-destructive">Invalid quiz format received.</Text>
            )}
          </View>
        )}
      </CardContent>
    </Card>
  );
}