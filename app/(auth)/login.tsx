import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { supabase } from '../../libs/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { GraduationCap } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert("Error", error.message);
    setLoading(false);
  }

  return (
    <View className="flex-1 justify-center p-8 bg-background">
      <View className="items-center mb-10 space-y-2">
        <View className="p-4 bg-primary/10 rounded-full mb-4">
          <GraduationCap size={40} className="text-primary" />
        </View>
        <Text className="text-3xl font-bold text-foreground">Welcome Back</Text>
        <Text className="text-muted-foreground text-center max-w-[250px]">
          Sign in to continue your learning journey
        </Text>
      </View>

      <View className="space-y-4">
        <Input 
          placeholder="Email" 
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none" 
          keyboardType="email-address"
          className="bg-card h-12"
        />
        <Input 
          placeholder="Password" 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
          className="bg-card h-12"
        />

        <Button onPress={signInWithEmail} disabled={loading} size="lg" className="mt-2">
          <Text className="text-primary-foreground font-bold text-base">
            {loading ? "Signing in..." : "Sign In"}
          </Text>
        </Button>
      </View>

      <View className="flex-row justify-center mt-8">
        <Text className="text-muted-foreground">Don't have an account? </Text>
        <Link href="/(auth)/signup" asChild>
          <Text className="text-primary font-bold">Sign Up</Text>
        </Link>
      </View>
    </View>
  );
}