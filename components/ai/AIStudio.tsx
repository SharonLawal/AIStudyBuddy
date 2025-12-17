import { useState } from "react";
import { View, Text, ScrollView, TextInput, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardContent } from "../ui/Card";
import { Upload, Sparkles, Brain, X, FileText, Trash2 } from "lucide-react-native";
import { AIService } from "../../libs/ai";
import { useNotification } from '../../providers/NotificationProvider';
import { QuizGame } from "./QuizGame";
import { QuizQuestion } from "../../types";

export function AIStudio() {
  const [loading, setLoading] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  
  const [attachedFile, setAttachedFile] = useState<{ name: string; mimeType: string; data: string } | null>(null);

  const [summaryResult, setSummaryResult] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<QuizQuestion[] | null>(null);
  const [activeAiTab, setActiveAiTab] = useState<"summary" | "quiz">("summary");
  const { showNotification } = useNotification();

  async function handleFileUpload() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', 
        copyToCacheDirectory: true
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const file = result.assets[0];
        
        if (file.name.endsWith('.pptx') || file.name.endsWith('.docx')) {
          Alert.alert("Unsupported File", "Please save as PDF first. The AI can read PDFs perfectly!");
          return;
        }

        const response = await fetch(file.uri);
        const blob = await response.blob();
        const reader = new FileReader();
        
        reader.onloadend = () => {
          const base64data = (reader.result as string).split(',')[1];
          setAttachedFile({
            name: file.name,
            mimeType: file.mimeType || 'application/pdf',
            data: base64data
          });
          if (!noteTitle) setNoteTitle(file.name);
          showNotification('success', 'File Attached', 'Ready for analysis.');
        };
        reader.readAsDataURL(blob);
      }
    } catch (err) {
      showNotification('error', 'Error', 'Failed to read file.');
    }
  }

  async function generateAIContent() {
    if (!noteContent.trim() && !attachedFile) {
      showNotification('error', 'Input Required', 'Please type notes or upload a PDF.');
      return;
    }

    setLoading(true);
    setSummaryResult(null);
    setQuizResult(null);

    const options = {
      text: noteContent,
      file: attachedFile ? { mimeType: attachedFile.mimeType, data: attachedFile.data } : undefined
    };

    try {
      if (activeAiTab === 'summary') {
        const summary = await AIService.generateSummary(options);
        setSummaryResult(summary);
      } else {
        const quiz = await AIService.generateQuiz(options);
        if (quiz && quiz.length > 0) {
          setQuizResult(quiz);
        } else {
          showNotification('error', 'AI Error', 'Could not generate a quiz. content was unclear.');
        }
      }
    } catch (e) {
      showNotification('error', 'AI Error', 'Failed to generate content.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
      {!quizResult && (
        <>
          <Card className="mb-6 bg-card border border-border dark:border-white/10">
            <CardContent className="p-4 gap-4">
              <View className="flex-row justify-between items-center border-b border-border/50 pb-2 mb-1">
                <Text className="font-semibold text-foreground flex-row items-center">
                  <FileText size={16} className="text-primary mr-2" /> Study Material
                </Text>
                <TouchableOpacity onPress={handleFileUpload} className="flex-row items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full">
                  <Upload size={14} color="#7c3aed" />
                  <Text className="text-primary text-xs font-bold">Upload PDF</Text>
                </TouchableOpacity>
              </View>

              {/* Show attached file */}
              {attachedFile && (
                <View className="bg-muted/50 p-3 rounded-xl flex-row items-center justify-between border border-border">
                  <View className="flex-row items-center gap-2 flex-1">
                    <FileText size={18} className="text-primary" />
                    <Text className="text-sm font-medium text-foreground flex-1" numberOfLines={1}>
                      {attachedFile.name}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setAttachedFile(null)}>
                    <Trash2 size={18} className="text-destructive" />
                  </TouchableOpacity>
                </View>
              )}

              <Input 
                placeholder="Topic Title (Optional)" 
                value={noteTitle}
                onChangeText={setNoteTitle}
                className="bg-muted/30 border-transparent h-12"
              />
              
              <TextInput
                multiline
                placeholder={attachedFile ? "Add specific instructions for the AI..." : "Paste your notes or essay here..."}
                placeholderTextColor="#9ca3af"
                className="min-h-[120px] bg-muted/30 p-4 rounded-2xl text-foreground border border-transparent text-base leading-6"
                style={{ textAlignVertical: 'top' }}
                value={noteContent}
                onChangeText={setNoteContent}
              />
            </CardContent>
          </Card>

          <View className="flex-row gap-3 mb-6 bg-muted/50 p-1 rounded-2xl">
            <TouchableOpacity 
              className={`flex-1 flex-row gap-2 items-center justify-center py-3 rounded-xl ${activeAiTab === 'summary' ? 'bg-background' : ''}`}
              onPress={() => setActiveAiTab('summary')}
            >
              <Sparkles size={18} color={activeAiTab === 'summary' ? "#d97706" : "#94a3b8"} />
              <Text className={`font-bold ${activeAiTab === 'summary' ? 'text-foreground' : 'text-muted-foreground'}`}>Summarize</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className={`flex-1 flex-row gap-2 items-center justify-center py-3 rounded-xl ${activeAiTab === 'quiz' ? 'bg-background' : ''}`}
              onPress={() => setActiveAiTab('quiz')}
            >
              <Brain size={18} color={activeAiTab === 'quiz' ? "#7c3aed" : "#94a3b8"} />
              <Text className={`font-bold ${activeAiTab === 'quiz' ? 'text-foreground' : 'text-muted-foreground'}`}>Generate Quiz</Text>
            </TouchableOpacity>
          </View>

          <Button size="lg" className="w-full mb-8 h-14 rounded-2xl shadow-md shadow-primary/20" onPress={generateAIContent} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">
                {activeAiTab === 'summary' ? '✨ Generate Summary' : '🚀 Start Quiz'}
              </Text>
            )}
          </Button>
        </>
      )}

      {summaryResult && activeAiTab === 'summary' && (
        <Card className="bg-card border border-primary/20 shadow-sm mb-10">
          <CardContent className="p-5">
            <View className="flex-row justify-between items-center mb-4 border-b border-border/50 pb-2">
              <Text className="font-bold text-xl text-primary">✨ Key Takeaways</Text>
              <TouchableOpacity onPress={() => setSummaryResult(null)}>
                <X size={20} className="text-muted-foreground" />
              </TouchableOpacity>
            </View>
            <Text className="text-foreground text-base leading-7">{summaryResult}</Text>
          </CardContent>
        </Card>
      )}

      {quizResult && activeAiTab === 'quiz' && (
        <View className="mb-10">
           <QuizGame questions={quizResult} onExit={() => setQuizResult(null)} />
        </View>
      )}

    </ScrollView>
  );
}