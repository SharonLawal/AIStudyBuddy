import { useState } from "react";
import { View, Text, ScrollView, TextInput, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
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
    setAiResult(null); 
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
      <Card className="mb-4 bg-card">
        <CardContent className="p-4 gap-4">
          <View className="flex-row justify-between items-center">
            <Text className="font-semibold text-foreground">Input Notes</Text>
            <TouchableOpacity onPress={handleFileUpload} className="flex-row items-center gap-2">
              <Upload size={16} className="text-primary" />
              <Text className="text-primary text-xs">Upload File</Text>
            </TouchableOpacity>
          </View>

          <Input 
            placeholder="Note Title (Optional)" 
            value={noteTitle}
            onChangeText={setNoteTitle}
            className="bg-background"
          />
          
          <TextInput
            multiline
            placeholder="Paste your study notes here..."
            className="min-h-[150px] bg-background p-3 rounded-md text-foreground border border-input text-base"
            style={{ textAlignVertical: 'top' }}
            value={noteContent}
            onChangeText={setNoteContent}
          />
        </CardContent>
      </Card>

      <View className="flex-row gap-3 mb-4">
        <TouchableOpacity 
          className={`flex-1 flex-row gap-2 items-center justify-center py-3 rounded-md ${activeAiTab === 'summary' ? 'bg-primary' : 'bg-muted'}`}
          onPress={() => setActiveAiTab('summary')}
        >
          <Sparkles size={16} className={activeAiTab === 'summary' ? 'text-primary-foreground' : 'text-foreground'} />
          <Text className={`font-medium ${activeAiTab === 'summary' ? 'text-primary-foreground' : 'text-foreground'}`}>Summary</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className={`flex-1 flex-row gap-2 items-center justify-center py-3 rounded-md ${activeAiTab === 'quiz' ? 'bg-primary' : 'bg-muted'}`}
          onPress={() => setActiveAiTab('quiz')}
        >
          <Brain size={16} className={activeAiTab === 'quiz' ? 'text-primary-foreground' : 'text-foreground'} />
          <Text className={`font-medium ${activeAiTab === 'quiz' ? 'text-primary-foreground' : 'text-foreground'}`}>Quiz</Text>
        </TouchableOpacity>
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
        <Card className="bg-secondary/10 border-secondary/20 mt-4">
          <CardContent className="p-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-bold text-lg text-foreground">
                {activeAiTab === 'summary' ? 'Summary' : 'Quiz Generated'}
              </Text>
              <TouchableOpacity onPress={() => setAiResult(null)}>
                <X size={16} className="text-muted-foreground" />
              </TouchableOpacity>
            </View>
            <Text className="text-foreground leading-6">{aiResult}</Text>
          </CardContent>
        </Card>
      )}
    </ScrollView>
  );
}