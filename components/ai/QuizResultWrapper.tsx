import { View, Text, TouchableOpacity } from "react-native";
import { BookOpen, Download } from "lucide-react-native";
import { QuizGame } from "./QuizGame";
import { QuizQuestion } from "../../types";

interface QuizResultWrapperProps {
  questions: QuizQuestion[];
  onExportPDF: () => void;
  onSaveLibrary: () => void;
  onClose: () => void;
}

export function QuizResultWrapper({ questions, onExportPDF, onSaveLibrary, onClose }: QuizResultWrapperProps) {
  return (
    <View className="mb-10">
       <View className="flex-row justify-end mb-4 px-4 gap-2">
          {/* Save to Library */}
          <TouchableOpacity onPress={onSaveLibrary} className="flex-row items-center gap-2 bg-green-100 px-4 py-2 rounded-lg border border-green-200">
            <BookOpen size={16} className="text-green-700" />
            <Text className="text-green-700 font-bold text-xs">Save to Library</Text>
          </TouchableOpacity>

          {/* Export PDF */}
          <TouchableOpacity onPress={onExportPDF} className="flex-row items-center gap-2 bg-blue-100 px-4 py-2 rounded-lg border border-blue-200">
            <Download size={16} className="text-blue-700" />
            <Text className="text-blue-700 font-bold text-xs">Export PDF</Text>
          </TouchableOpacity>
       </View>

       <QuizGame 
         questions={questions} 
         onExit={onClose} 
       />
    </View>
  );
}