import { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardContent } from "../ui/Card";
import { Upload, Sparkles, Brain, X } from "lucide-react-native";
import { AIService } from "../../libs/ai";

export function AIStudio() {
  const [loading, setLoading] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [activeAiTab, setActiveAiTab] = useState<"summary" | "quiz">("summary");

  async function handleFileUpload() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', 
        copyToCacheDirectory: true
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setNoteTitle(result.assets[0].name);
        setNoteContent(`(File loaded: ${result.assets[0].name})\n\n[Content placeholder]`);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to pick file");
    }
  }

  async function generateAIContent() {
    if (!noteContent.trim()) {
      Alert.alert("Empty Note", "Please type some notes or upload a file first.");
      return;
    }

    setLoading(true);
    try {
      if (activeAiTab === 'summary') {
        const summary = await AIService.generateSummary(noteContent);
        setAiResult(summary);
      } else {
        const quiz = await AIService.generateQuiz(noteContent);
        setAiResult(JSON.stringify(quiz)); 
      }
    } catch (e) {
      Alert.alert("AI Error", "Failed to generate content.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Input Section */}
      <Card className="mb-4">
        <CardContent className="p-4 gap-4">
          <View className="flex-row justify-between items-center">
            <Text className="font-semibold text-foreground">Input Notes</Text>
            <Button variant="ghost" size="sm" className="flex-row gap-2" onPress={handleFileUpload}>
              <Upload size={16} className="text-primary" />
              <Text className="text-primary text-xs">Upload File</Text>
            </Button>
          </View>

          <Input 
            placeholder="Note Title (Optional)" 
            value={noteTitle}
            onChangeText={setNoteTitle}
            className="bg-background"
          />
          
          <TextInput
            multiline
            placeholder="Paste your study notes here or upload a file..."
            className="min-h-[150px] bg-background p-3 rounded-md text-foreground border border-input"
            style={{ textAlignVertical: 'top' }}
            value={noteContent}
            onChangeText={setNoteContent}
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <View className="flex-row gap-3 mb-4">
        <Button 
          className={`flex-1 flex-row gap-2 ${activeAiTab === 'summary' ? 'bg-primary' : 'bg-muted'}`}
          onPress={() => setActiveAiTab('summary')}
        >
          <Sparkles size={16} className={activeAiTab === 'summary' ? 'text-primary-foreground' : 'text-foreground'} />
          <Text className={activeAiTab === 'summary' ? 'text-primary-foreground' : 'text-foreground'}>Summary</Text>
        </Button>
        <Button 
          className={`flex-1 flex-row gap-2 ${activeAiTab === 'quiz' ? 'bg-primary' : 'bg-muted'}`}
          onPress={() => setActiveAiTab('quiz')}
        >
          <Brain size={16} className={activeAiTab === 'quiz' ? 'text-primary-foreground' : 'text-foreground'} />
          <Text className={activeAiTab === 'quiz' ? 'text-primary-foreground' : 'text-foreground'}>Quiz</Text>
        </Button>
      </View>

      <Button size="lg" className="w-full mb-6" onPress={generateAIContent} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-primary-foreground font-bold">Generate {activeAiTab === 'summary' ? 'Summary' : 'Quiz'}</Text>
        )}
      </Button>

      {/* Result Section */}
      {aiResult && (
        <AIResultDisplay result={aiResult} type={activeAiTab} onClose={() => setAiResult(null)} />
      )}
    </ScrollView>
  );
}

// Sub-component for displaying results cleanly
function AIResultDisplay({ result, type, onClose }: { result: string, type: string, onClose: () => void }) {
  return (
    <Card className="bg-secondary/10 border-secondary/20 mt-4">
      <CardContent className="p-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="font-bold text-lg text-foreground">
            {type === 'summary' ? 'Summary' : 'Quiz Generated'}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <X size={16} className="text-muted-foreground" />
          </TouchableOpacity>
        </View>

        {type === 'summary' ? (
          <Text className="text-foreground leading-6">{result}</Text>
        ) : (
          <View className="gap-4">
            {(() => {
              try {
                const questions = JSON.parse(result);
                if (!Array.isArray(questions)) return <Text className="text-destructive">Invalid quiz format received.</Text>;
                
                return questions.map((q: any, i: number) => (
                  <View key={i} className="gap-2 border-b border-border/50 pb-4">
                    <Text className="font-semibold text-foreground">{i + 1}. {q.question}</Text>
                    {q.options.map((opt: string, idx: number) => (
                      <View key={idx} className={`p-2 rounded-md ${idx === q.answer ? 'bg-green-500/20' : 'bg-muted'}`}>
                        <Text className={idx === q.answer ? 'text-green-700 font-medium' : 'text-foreground'}>
                          {opt} {idx === q.answer && "(Correct)"}
                        </Text>
                      </View>
                    ))}
                  </View>
                ));
              } catch (e) {
                return <Text className="text-destructive">Error parsing quiz data.</Text>;
              }
            })()}
          </View>
        )}
      </CardContent>
    </Card>
  );
}