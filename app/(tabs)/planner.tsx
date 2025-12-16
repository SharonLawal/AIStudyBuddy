import { useState, useEffect } from "react";
import { View, Text, FlatList, Modal, TouchableOpacity, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker'; // ✅ NEW IMPORT
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Plus, X, BookOpen, GraduationCap, Coffee, Dumbbell, Calendar, Clock } from "lucide-react-native";
import { supabase } from "../../libs/supabase";
import { useAuth } from "../../providers/AuthProvider";

const categoryConfig: any = { 
  class: { icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-100", label: "Class" },
  study: { icon: BookOpen, color: "text-blue-600", bg: "bg-blue-100", label: "Study" },
  break: { icon: Coffee, color: "text-orange-600", bg: "bg-orange-100", label: "Break" },
  activity: { icon: Dumbbell, color: "text-green-600", bg: "bg-green-100", label: "Activity" }
};

export default function PlannerScreen() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("study");
  
  // Time Picker State
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(new Date().setHours(new Date().getHours() + 1)));
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    if(user) fetchSchedule();
  }, [user]);

  async function fetchSchedule() {
    const { data } = await supabase.from('schedule').select('*').order('start_time', { ascending: true });
    if (data) setSchedule(data);
  }

  // Format Date object to "HH:MM" string for display/storage
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  async function addItem() {
    if (!title.trim()) {
      Alert.alert("Required", "Please enter a title for your event.");
      return;
    }

    const { data, error } = await supabase.from('schedule').insert([{
      user_id: user?.id,
      title,
      start_time: formatTime(startTime),
      end_time: formatTime(endTime),
      category,
      type: 'fixed'
    }]).select();

    if (data) {
      setSchedule([...schedule, data[0]].sort((a, b) => a.start_time.localeCompare(b.start_time)));
      setModalVisible(false);
      setTitle("");
    }
  }

  // Handle Time Selection
  const onTimeChange = (event: any, selectedDate?: Date, type?: 'start' | 'end') => {
    if (Platform.OS === 'android') {
      if (type === 'start') setShowStartPicker(false);
      else setShowEndPicker(false);
    }
    
    if (selectedDate) {
      if (type === 'start') setStartTime(selectedDate);
      else setEndTime(selectedDate);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1 p-4">
        {/* Header */}
        <View className="mb-6 flex-row justify-between items-center">
          <View>
            <Text className="text-3xl font-bold text-foreground">Planner</Text>
            <Text className="text-muted-foreground">Design your day</Text>
          </View>
          <Button size="icon" className="rounded-full h-12 w-12 bg-primary shadow-lg" onPress={() => setModalVisible(true)}>
            <Plus size={24} className="text-white" />
          </Button>
        </View>

        {/* Timeline List */}
        <FlatList
          data={schedule}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => {
            const config = categoryConfig[item.category] || categoryConfig.study;
            const Icon = config.icon;
            
            return (
              <Card className="mb-3 border-0 shadow-sm bg-card">
                <CardContent className="p-4 flex-row items-center gap-4">
                  <View className="items-center justify-center w-14">
                    <Text className="font-bold text-foreground">{item.start_time}</Text>
                    <View className="h-8 w-[2px] bg-border my-1 rounded-full" />
                    <Text className="text-xs text-muted-foreground">{item.end_time}</Text>
                  </View>
                  
                  <View className={`p-3 rounded-2xl ${config.bg}`}>
                    <Icon size={20} className={config.color} />
                  </View>
                  
                  <View className="flex-1">
                    <Text className="font-bold text-lg text-foreground">{item.title}</Text>
                    <Text className="text-xs text-muted-foreground capitalize">{item.category}</Text>
                  </View>
                </CardContent>
              </Card>
            );
          }}
        />

        {/* Stylish Modal */}
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View className="flex-1 justify-end bg-black/60">
            <View className="bg-background p-6 rounded-t-[32px] gap-6 shadow-2xl">
              
              <View className="flex-row justify-between items-center border-b border-border pb-4">
                <Text className="text-xl font-bold text-foreground">New Event</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)} className="p-2 bg-muted rounded-full">
                  <X size={20} className="text-foreground" />
                </TouchableOpacity>
              </View>
              
              {/* Title Input */}
              <View className="gap-2">
                <Text className="font-medium text-foreground ml-1">Title</Text>
                <Input placeholder="E.g. Math Exam" value={title} onChangeText={setTitle} className="bg-muted/50 border-0 h-12 rounded-2xl" />
              </View>

              {/* Time Pickers */}
              <View className="flex-row gap-4">
                <View className="flex-1 gap-2">
                  <Text className="font-medium text-foreground ml-1">Start Time</Text>
                  <TouchableOpacity 
                    onPress={() => setShowStartPicker(true)}
                    className="flex-row items-center bg-muted/50 h-12 px-4 rounded-2xl"
                  >
                    <Clock size={18} className="text-primary mr-2" />
                    <Text className="text-foreground font-medium">{formatTime(startTime)}</Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-1 gap-2">
                  <Text className="font-medium text-foreground ml-1">End Time</Text>
                  <TouchableOpacity 
                    onPress={() => setShowEndPicker(true)}
                    className="flex-row items-center bg-muted/50 h-12 px-4 rounded-2xl"
                  >
                    <Clock size={18} className="text-primary mr-2" />
                    <Text className="text-foreground font-medium">{formatTime(endTime)}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Logic to show DatePicker */}
              {showStartPicker && (
                <DateTimePicker 
                  value={startTime} 
                  mode="time" 
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(e, d) => onTimeChange(e, d, 'start')}
                />
              )}
              {showEndPicker && (
                <DateTimePicker 
                  value={endTime} 
                  mode="time" 
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(e, d) => onTimeChange(e, d, 'end')}
                />
              )}

              {/* Category Selection */}
              <View className="gap-2">
                <Text className="font-medium text-foreground ml-1">Category</Text>
                <View className="flex-row justify-between">
                  {Object.entries(categoryConfig).map(([key, config]: any) => (
                    <TouchableOpacity 
                      key={key} 
                      onPress={() => setCategory(key)}
                      className={`items-center justify-center w-20 h-20 rounded-2xl border-2 ${category === key ? "border-primary bg-primary/5" : "border-transparent bg-muted/50"}`}
                    >
                      <config.icon size={24} className={category === key ? "text-primary" : "text-muted-foreground"} />
                      <Text className={`text-xs mt-1 ${category === key ? "text-primary font-bold" : "text-muted-foreground"}`}>
                        {config.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Button onPress={addItem} size="lg" className="rounded-2xl h-14 bg-primary shadow-lg mt-2">
                <Text className="text-white font-bold text-lg">Create Event</Text>
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}