import { useState } from "react";
import { ScrollView, View, ActivityIndicator, Text, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { readAsStringAsync } from "expo-file-system/legacy";

// Components
import { Button } from "../ui/Button";
import { StudioInput } from "./StudioInput";
import { StudioSettings } from "./StudioSettings";
import { SummaryResult } from "./SummaryResult";
import { QuizResultWrapper } from "./QuizResultWrapper";

// Logic & Services
import { useNotification } from "../../providers/NotificationProvider";
import { AIService } from "../../libs/ai";
import { extractTextFromPPTX } from "../../libs/parsePptx";
import { supabase } from "../../libs/supabase";
import { useAuth } from "../../providers/AuthProvider";
import { QuizQuestion } from "../../types";

export function AIStudio() {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  // State
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    mimeType: string;
    data: string;
    uri: string;
  } | null>(null);
  const [activeAiTab, setActiveAiTab] = useState<"summary" | "quiz">("summary");

  // Results
  const [summaryResult, setSummaryResult] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<QuizQuestion[] | null>(null);

  // --- LOGIC: FILE HANDLING ---
  async function handleFileUpload() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        const file = result.assets[0];
        const fileName = file.name.toLowerCase();

        if (fileName.endsWith(".pptx")) {
          setLoading(true);
          setLoadingStep("Reading Slides...");
          try {
            const pptText = await extractTextFromPPTX(file.uri);
            setNoteContent(
              (prev) =>
                (prev ? prev + "\n\n" : "") +
                `--- CONTENT FROM ${file.name} ---\n` +
                pptText
            );
            if (!noteTitle) setNoteTitle(file.name);
            showNotification("success", "Slides Loaded", "Text extracted!");
          } catch (e) {
            Alert.alert("Error", "Could not parse PowerPoint.");
          } finally {
            setLoading(false);
            setLoadingStep("");
          }
          return;
        }
        if (fileName.endsWith(".txt") || fileName.endsWith(".md")) {
          try {
            const textContent = await readAsStringAsync(file.uri, {
              encoding: "utf8",
            });
            setNoteContent((prev) => prev + "\n" + textContent);
            if (!noteTitle) setNoteTitle(file.name);
          } catch (e) {}
          return;
        }
        if (fileName.endsWith(".pdf")) {
          try {
            const base64 = await readAsStringAsync(file.uri, {
              encoding: "base64",
            });
            setAttachedFile({
              name: file.name,
              mimeType: "application/pdf",
              data: base64,
              uri: file.uri,
            });
            if (!noteTitle) setNoteTitle(file.name);
          } catch (e) {}
        }
      }
    } catch (err) {
      showNotification("error", "Error", "Failed to pick file.");
    }
  }

  // --- LOGIC: GENERATE ---
  async function generateAIContent() {
    if (!noteContent.trim() && !attachedFile) {
      showNotification(
        "error",
        "Input Required",
        "Please type notes or upload a file."
      );
      return;
    }
    setLoading(true);
    setLoadingStep("Thinking...");
    setSummaryResult(null);
    setQuizResult(null);
    try {
      const options = {
        text: noteContent,
        file: attachedFile
          ? { mimeType: attachedFile.mimeType, data: attachedFile.data }
          : undefined,
        questionCount: numQuestions,
      };
      if (activeAiTab === "summary") {
        const summary = await AIService.generateSummary(options);
        setSummaryResult(summary);
      } else {
        const quiz = await AIService.generateQuiz(options);
        if (quiz && quiz.length > 0) setQuizResult(quiz);
        else Alert.alert("AI Error", "Could not generate quiz.");
      }
    } catch (e) {
      Alert.alert("Error", "AI Generation Failed");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  }

  // --- LOGIC: SAVING ---
  async function saveSummaryToNotes() {
    if (!summaryResult || !user) return;
    setLoading(true);
    try {
      const fullContent = `# ${noteTitle || "AI Summary"}\n\n${summaryResult}\n\n## Original Notes\n${noteContent}`;
      const { error } = await supabase.from("notes").insert({
        user_id: user.id,
        title: noteTitle || "AI Study Session",
        content: fullContent,
        is_ai_generated: true,
      });
      if (error) throw error;
      showNotification("success", "Saved!", "Summary saved to Library.");
    } catch (e: any) {
      Alert.alert("Save Failed", e.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveQuizToLibrary() {
    if (!quizResult || !user) return;
    setLoading(true);
    try {
      let content =
        `# Quiz: ${noteTitle || "Study Session"}\n\n` +
        quizResult
          .map(
            (q, i) =>
              `**Q${i + 1}: ${q.question}**\n${q.options.map((o, idx) => `- ${o} ${idx === q.answer ? "✅" : ""}`).join("\n")}`
          )
          .join("\n\n");

      const { error } = await supabase.from("notes").insert({
        user_id: user.id,
        title: `Quiz: ${noteTitle || "Untitled"}`,
        content: content,
        is_ai_generated: true,
      });

      if (error) throw error;
      showNotification("success", "Saved!", "Quiz saved to Library.");
    } catch (e: any) {
      Alert.alert("Save Failed", e.message);
    } finally {
      setLoading(false);
    }
  }

  async function exportQuizAsPDF() {
    if (!quizResult) return;
    try {
      const html = `<html><head><style>body{font-family:sans-serif;padding:40px}h1{color:#7c3aed}.answer{color:green;font-weight:bold}</style></head><body><h1>Quiz: ${noteTitle}</h1>${quizResult.map((q, i) => `<div><h3>Q${i + 1}: ${q.question}</h3><ul>${q.options.map((o, idx) => `<li>${String.fromCharCode(65 + idx)}) ${o}</li>`).join("")}</ul><div class="answer">Correct: ${q.options[q.answer]}</div><hr/></div>`).join("")}</body></html>`;
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        UTI: ".pdf",
        mimeType: "application/pdf",
      });
    } catch (e) {
      Alert.alert("Export Error", "Failed to create PDF.");
    }
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {!quizResult && (
        <>
          <StudioInput
            noteTitle={noteTitle}
            setNoteTitle={setNoteTitle}
            noteContent={noteContent}
            setNoteContent={setNoteContent}
            attachedFile={attachedFile}
            onUploadFile={handleFileUpload}
            onClearFile={() => setAttachedFile(null)}
          />

          <StudioSettings
            activeTab={activeAiTab}
            setActiveTab={setActiveAiTab}
            numQuestions={numQuestions}
            setNumQuestions={setNumQuestions}
            minQuestions={5}
            maxQuestions={50}
          />

          <Button
            size="lg"
            className="w-full mb-8 h-14 rounded-2xl shadow-md shadow-primary/20"
            onPress={generateAIContent}
            disabled={loading}
          >
            {loading ? (
              <View className="flex-row gap-2 items-center">
                <ActivityIndicator color="#fff" />
                <Text className="text-white font-medium">
                  {loadingStep || "Processing..."}
                </Text>
              </View>
            ) : (
              <Text className="text-white font-bold text-lg">
                {activeAiTab === "summary"
                  ? "✨ Generate Summary"
                  : "🚀 Start Quiz"}
              </Text>
            )}
          </Button>
        </>
      )}

      {summaryResult && activeAiTab === "summary" && (
        <SummaryResult
          summary={summaryResult}
          onSave={saveSummaryToNotes}
          onClose={() => setSummaryResult(null)}
        />
      )}

      {quizResult && activeAiTab === "quiz" && (
        <QuizResultWrapper
          questions={quizResult}
          onSaveLibrary={saveQuizToLibrary}
          onExportPDF={exportQuizAsPDF}
          onClose={() => setQuizResult(null)}
        />
      )}
    </ScrollView>
  );
}
