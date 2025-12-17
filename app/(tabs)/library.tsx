import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { FileText, Bot, ChevronRight } from 'lucide-react-native';
import { supabase } from '../../libs/supabase';
import { useAuth } from '../../providers/AuthProvider';

interface Note {
  id: string;
  title: string;
  content: string;
  is_ai_generated: boolean;
  created_at: string;
}

export default function LibraryScreen() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  async function fetchNotes() {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [])
  );

  const renderItem = ({ item }: { item: Note }) => (
    <TouchableOpacity 
      className="bg-card p-4 rounded-xl mb-3 border border-border flex-row items-center justify-between shadow-sm"
      onPress={() => router.push(`/note/${item.id}`)}
    >
      <View className="flex-row items-center gap-3 flex-1">
        <View className={`w-10 h-10 rounded-full items-center justify-center ${item.is_ai_generated ? 'bg-purple-100' : 'bg-blue-100'}`}>
          {item.is_ai_generated ? (
            <Bot size={20} color="#7c3aed" />
          ) : (
            <FileText size={20} color="#2563eb" />
          )}
        </View>
        <View className="flex-1">
          <Text className="font-bold text-foreground text-base" numberOfLines={1}>{item.title}</Text>
          <Text className="text-muted-foreground text-xs mt-1" numberOfLines={1}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      <ChevronRight size={20} className="text-muted-foreground" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold text-foreground mb-6">My Library</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#7c3aed" />
        ) : (
          <FlatList
            data={notes}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchNotes(); }} />}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={
              <View className="items-center justify-center mt-20 opacity-50">
                <FileText size={48} color="gray" />
                <Text className="text-muted-foreground mt-4 text-center">No notes yet.{"\n"}Go to AI Studio to start studying!</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}