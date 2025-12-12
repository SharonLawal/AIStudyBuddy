import { Tabs } from 'expo-router';
import { Home, Target, Calendar, FileText, Settings } from 'lucide-react-native';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: '#1e293b', 
          borderTopColor: '#334155',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: '#94a3b8',
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="focus" 
        options={{ 
          title: 'Focus',
          tabBarIcon: ({ color }) => <Target size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="planner" 
        options={{ 
          title: 'Planner',
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="notes" 
        options={{ 
          title: 'Notes',
          tabBarIcon: ({ color }) => <FileText size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="settings" 
        options={{ 
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings size={24} color={color} /> 
        }} 
      />
    </Tabs>
  );
}