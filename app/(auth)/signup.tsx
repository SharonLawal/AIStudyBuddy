import React, { useState } from 'react';
import { View, Text, Alert, Image } from 'react-native';
import { supabase } from '../../libs/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Link, useRouter } from 'expo-router';
import { GraduationCap } from 'lucide-react-native';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signUpWithEmail() {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) Alert.alert("Error", error.message);
    else {
      Alert.alert("Success", "Check your email for confirmation!");
      // Optionally redirect to login
      router.replace('/(auth)/login');
    }
    setLoading(false);
  }

  return (
    <View className="flex-1 justify-center p-8 bg-background">
      <View className="items-center mb-8 space-y-2">
        <View className="p-4 bg-primary/10 rounded-full mb-4">
          <GraduationCap size={40} className="text-primary" />
        </View>
        <Text className="text-3xl font-bold text-foreground text-center">Create Account</Text>
        <Text className="text-muted-foreground text-center">Join AI Study Buddy today</Text>
      </View>

      <View className="space-y-4">
        <Input 
          placeholder="Full Name" 
          value={name} 
          onChangeText={setName} 
          autoCapitalize="words"
          className="bg-card" 
        />
        <Input 
          placeholder="Email" 
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none"
          keyboardType="email-address"
          className="bg-card" 
        />
        <Input 
          placeholder="Password" 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
          className="bg-card"
        />

        <Button onPress={signUpWithEmail} disabled={loading} size="lg" className="mt-2">
          <Text className="text-primary-foreground font-bold text-base">
            {loading ? "Creating Account..." : "Sign Up"}
          </Text>
        </Button>
      </View>

      <View className="flex-row justify-center mt-8">
        <Text className="text-muted-foreground">Already have an account? </Text>
        <Link href="/(auth)/login" asChild>
          <Text className="text-primary font-bold">Log In</Text>
        </Link>
      </View>
    </View>
  );
}