import { View, Text, TouchableOpacity } from "react-native";
import { Sparkles, Brain, Minus, Plus } from "lucide-react-native";

interface StudioSettingsProps {
  activeTab: "summary" | "quiz";
  setActiveTab: (tab: "summary" | "quiz") => void;
  numQuestions: number;
  setNumQuestions: (num: number) => void;
  minQuestions: number;
  maxQuestions: number;
}

export function StudioSettings({ 
  activeTab, setActiveTab, 
  numQuestions, setNumQuestions, 
  minQuestions, maxQuestions 
}: StudioSettingsProps) {
  return (
    <View className="mb-6">
      {/* Tab Switcher */}
      <View className="flex-row gap-3 bg-muted/50 p-1 rounded-2xl mb-4">
        <TouchableOpacity 
          className={`flex-1 flex-row gap-2 items-center justify-center py-3 rounded-xl ${activeTab === 'summary' ? 'bg-background' : ''}`}
          onPress={() => setActiveTab('summary')}
        >
          <Sparkles size={18} color={activeTab === 'summary' ? "#d97706" : "#94a3b8"} />
          <Text className={`font-bold ${activeTab === 'summary' ? 'text-foreground' : 'text-muted-foreground'}`}>Summarize</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className={`flex-1 flex-row gap-2 items-center justify-center py-3 rounded-xl ${activeTab === 'quiz' ? 'bg-background' : ''}`}
          onPress={() => setActiveTab('quiz')}
        >
          <Brain size={18} color={activeTab === 'quiz' ? "#7c3aed" : "#94a3b8"} />
          <Text className={`font-bold ${activeTab === 'quiz' ? 'text-foreground' : 'text-muted-foreground'}`}>Generate Quiz</Text>
        </TouchableOpacity>
      </View>

      {/* Question Counter (Only for Quiz) */}
      {activeTab === 'quiz' && (
        <View className="flex-row items-center justify-between bg-card p-4 rounded-xl border border-border">
          <Text className="font-semibold text-foreground">Number of Questions:</Text>
          <View className="flex-row items-center gap-4">
            <TouchableOpacity 
              onPress={() => setNumQuestions(Math.max(minQuestions, numQuestions - 5))}
              disabled={numQuestions <= minQuestions}
              className={`w-8 h-8 rounded-full items-center justify-center ${numQuestions <= minQuestions ? 'bg-muted/50 opacity-50' : 'bg-muted'}`}
            >
              <Minus size={16} className={numQuestions <= minQuestions ? "text-muted-foreground" : "text-foreground"} />
            </TouchableOpacity>

            <Text className="font-bold text-lg text-primary">{numQuestions}</Text>
            
            <TouchableOpacity 
              onPress={() => setNumQuestions(Math.min(maxQuestions, numQuestions + 5))}
              disabled={numQuestions >= maxQuestions}
              className={`w-8 h-8 rounded-full items-center justify-center ${numQuestions >= maxQuestions ? 'bg-muted/50 opacity-50' : 'bg-muted'}`}
            >
              <Plus size={16} className={numQuestions >= maxQuestions ? "text-muted-foreground" : "text-foreground"} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}