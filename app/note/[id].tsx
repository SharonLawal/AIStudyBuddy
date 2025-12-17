import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Markdown from "react-native-marked";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import {
  Download,
  Trash2,
  ArrowLeft,
  Save,
  PenLine,
} from "lucide-react-native";
import { supabase } from "../../libs/supabase";
import { useNotification } from "../../providers/NotificationProvider";

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  const [userNotes, setUserNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    fetchNote();
  }, [id]);

  async function fetchNote() {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setNote(data);
      setUserNotes(data.user_notes || "");
    } catch (e) {
      showNotification("error", "Error", "Failed to load note.");
      router.back();
    } finally {
      setLoading(false);
    }
  }

  // Function to Save Only the Personal Notes
  async function saveUserNotes() {
    setSavingNotes(true);
    try {
      const { error } = await supabase
        .from("notes")
        .update({ user_notes: userNotes })
        .eq("id", id);

      if (error) throw error;
      showNotification(
        "success",
        "Saved",
        "Your personal notes have been saved."
      );
    } catch (e) {
      showNotification("error", "Error", "Failed to save personal notes.");
    } finally {
      setSavingNotes(false);
    }
  }

  async function exportPDF() {
    if (!note) return;
    try {
      const html = `
        <html>
          <head>
            <style>
              body { font-family: Helvetica, sans-serif; padding: 40px; color: #333; }
              h1 { color: #7c3aed; border-bottom: 2px solid #eee; padding-bottom: 10px; }
              h2 { margin-top: 30px; color: #4b5563; }
              .user-notes { margin-top: 50px; padding: 20px; background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; }
              div { line-height: 1.6; font-size: 14px; white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <h1>${note.title}</h1>
            <div>${note.content}</div> 
            
            ${
              userNotes
                ? `
              <div class="user-notes">
                <h3>My Personal Notes:</h3>
                <p>${userNotes.replace(/\n/g, "<br/>")}</p>
              </div>
            `
                : ""
            }
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        UTI: ".pdf",
        mimeType: "application/pdf",
      });
    } catch (e) {
      showNotification("error", "Export Error", "Failed to create PDF.");
    }
  }

  async function deleteNote() {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note? This cannot be undone.",
      [
        { 
          text: "Cancel", 
          style: "cancel" 
        },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              const { error } = await supabase.from("notes").delete().eq("id", id);
              if (error) throw error;
              router.back();
            } catch (error) {
              showNotification("error", "Error", "Failed to delete note.");
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* HEADER */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-border/50 bg-card">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={24} className="text-foreground" />
          </TouchableOpacity>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={exportPDF}
              className="bg-blue-100 p-2 rounded-full"
            >
              <Download size={20} className="text-blue-700" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={deleteNote}
              className="bg-red-100 p-2 rounded-full"
            >
              <Trash2 size={20} className="text-red-700" />
            </TouchableOpacity>
          </View>
        </View>

        {/* CONTENT */}
        <ScrollView
          className="flex-1 p-5"
          contentContainerStyle={{ paddingBottom: 150 }}
        >
          <Text className="text-3xl font-bold text-primary mb-6">
            {note?.title}
          </Text>

          {/* AI Generated Content */}
          <Markdown
            value={note?.content}
            flatListProps={{
              initialNumToRender: 8,
              scrollEnabled: false,
              nestedScrollEnabled: false,
            }}
            theme={{
              colors: {
                text: "#1f2937",
                background: "transparent",
                code: "#f3f4f6",
                link: "#7c3aed",
                border: "#e5e7eb",
              },
            }}
          />

          <View className="h-[1px] bg-border my-8" />

          {/* USER NOTES SECTION */}
          <View className="mb-10">
            <View className="flex-row items-center gap-2 mb-3">
              <PenLine size={20} className="text-primary" />
              <Text className="text-lg font-bold text-foreground">
                My Personal Notes
              </Text>
            </View>

            <View className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
              <TextInput
                multiline
                placeholder="Write your own thoughts, reminders, or summaries here..."
                placeholderTextColor="#9ca3af"
                className="p-4 min-h-[150px] text-base text-foreground leading-6"
                style={{ textAlignVertical: "top" }}
                value={userNotes}
                onChangeText={setUserNotes}
              />

              <View className="bg-muted/30 p-3 border-t border-border flex-row justify-end">
                <TouchableOpacity
                  onPress={saveUserNotes}
                  disabled={savingNotes}
                  className="bg-primary px-4 py-2 rounded-lg flex-row items-center gap-2"
                >
                  {savingNotes ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Save size={16} color="white" />
                      <Text className="text-white font-bold">Save Notes</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
