import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckSquare, Trash2, Plus } from 'lucide-react-native';

const mockTasks = [
  { id: '1', text: 'Review Bio Notes', priority: 'high', completed: false },
  { id: '2', text: 'Math Homework', priority: 'medium', completed: true },
  { id: '3', text: 'Email Professor', priority: 'low', completed: false },
];

export default function Notes() {
  const [mode, setMode] = useState<'tasks' | 'notes'>('tasks');
  const [tasks, setTasks] = useState(mockTasks);

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      <View className="flex-row bg-card p-1 rounded-xl mb-6">
        {['tasks', 'notes'].map((m) => (
          <TouchableOpacity 
            key={m} 
            onPress={() => setMode(m as any)}
            className={`flex-1 py-2 items-center rounded-lg ${mode === m ? 'bg-primary' : 'bg-transparent'}`}
          >
            <Text className={`font-bold capitalize ${mode === m ? 'text-white' : 'text-muted'}`}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {mode === 'tasks' ? (
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View className="bg-card p-4 rounded-xl mb-3 flex-row items-center gap-3">
              <TouchableOpacity className={`w-5 h-5 border rounded ${item.completed ? 'bg-primary border-primary' : 'border-muted'}`}>
                {item.completed && <CheckSquare size={18} color="white" />}
              </TouchableOpacity>
              <Text className={`flex-1 text-text ${item.completed ? 'line-through text-muted' : ''}`}>{item.text}</Text>
              <View className={`px-2 py-1 rounded text-xs ${
                item.priority === 'high' ? 'bg-red-500/20' : item.priority === 'medium' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
              }`}>
                <Text className={
                  item.priority === 'high' ? 'text-red-400' : item.priority === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                }>{item.priority}</Text>
              </View>
            </View>
          )}
        />
      ) : (
        <View className="flex-1 bg-card rounded-xl p-4">
          <TextInput 
            multiline 
            placeholder="Start typing notes..." 
            placeholderTextColor="#64748b" 
            className="text-text flex-1 text-base leading-6"
            textAlignVertical="top"
          />
        </View>
      )}
    </SafeAreaView>
  );
}