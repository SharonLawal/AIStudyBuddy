import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Input } from "../ui/Input";
import { Card, CardContent } from "../ui/Card";
import { Upload, FileText, Trash2 } from "lucide-react-native";

interface StudioInputProps {
  noteTitle: string;
  setNoteTitle: (text: string) => void;
  noteContent: string;
  setNoteContent: (text: string) => void;
  attachedFile: { name: string } | null;
  onClearFile: () => void;
  onUploadFile: () => void;
}

export function StudioInput({ 
  noteTitle, setNoteTitle, 
  noteContent, setNoteContent, 
  attachedFile, onClearFile, onUploadFile 
}: StudioInputProps) {
  return (
    <Card className="mb-6 bg-card border border-border dark:border-white/10">
      <CardContent className="p-4 gap-4">
        {/* Header & Upload Button */}
        <View className="flex-row justify-between items-center border-b border-border/50 pb-2 mb-1">
          <Text className="font-semibold text-foreground flex-row items-center">
            <FileText size={16} className="text-primary mr-2" /> Study Material
          </Text>
          <TouchableOpacity onPress={onUploadFile} className="flex-row items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full">
            <Upload size={14} color="#7c3aed" />
            <Text className="text-primary text-xs font-bold">Upload File</Text>
          </TouchableOpacity>
        </View>

        {/* File Preview */}
        {attachedFile && (
          <View className="bg-muted/50 p-3 rounded-xl flex-row items-center justify-between border border-border">
            <View className="flex-row items-center gap-2 flex-1">
              <FileText size={18} className="text-primary" />
              <View>
                <Text className="text-sm font-medium text-foreground" numberOfLines={1}>
                  {attachedFile.name}
                </Text>
                <Text className="text-xs text-muted-foreground">Ready for analysis</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClearFile}>
              <Trash2 size={18} className="text-destructive" />
            </TouchableOpacity>
          </View>
        )}

        {/* Inputs */}
        <Input 
          placeholder="Topic Title (Optional)" 
          value={noteTitle}
          onChangeText={setNoteTitle}
          className="bg-muted/30 border-transparent h-12"
        />
        
        <TextInput
          multiline
          placeholder={attachedFile ? "Add specific instructions..." : "Paste your notes here, or upload a PDF/PPT..."}
          placeholderTextColor="#9ca3af"
          className="min-h-[120px] bg-muted/30 p-4 rounded-2xl text-foreground border border-transparent text-base leading-6"
          style={{ textAlignVertical: 'top' }}
          value={noteContent}
          onChangeText={setNoteContent}
        />
      </CardContent>
    </Card>
  );
}