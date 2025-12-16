import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import { supabase } from '../../libs/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react-native';
import { useNotification } from '../../providers/NotificationProvider';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showNotification } = useNotification();

  async function sendResetLink() {
    if (!email) {
      showNotification('error', 'Missing Email', 'Please enter your email address.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'aistudybuddy://reset-password', // Ensure this scheme matches your app.json
    });

    if (error) {
      showNotification('error', 'Failed', error.message);
    } else {
      showNotification('success', 'Success', 'We\'ve sent you a password reset link.');
      router.back();
    }
    setLoading(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-8">
          
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} className="mb-8 w-10 h-10 items-center justify-center bg-muted rounded-full">
            <ArrowLeft size={20} className="text-foreground" />
          </TouchableOpacity>

          <View className="items-center mb-8">
            <View className="w-16 h-16 bg-primary/10 rounded-2xl items-center justify-center mb-4">
              <KeyRound size={32} className="text-primary" />
            </View>
            <Text className="text-3xl font-bold text-foreground mb-2">Forgot Password?</Text>
            <Text className="text-muted-foreground text-center">
              No worries! Enter your email and we'll send you reset instructions.
            </Text>
          </View>

          <View className="gap-5">
            <View>
              <Text className="text-foreground font-medium mb-2 ml-1">Email</Text>
              <Input 
                placeholder="student@example.com" 
                value={email} 
                onChangeText={setEmail} 
                autoCapitalize="none"
                keyboardType="email-address"
                icon={<Mail size={20} color="#94a3b8" />}
              />
            </View>

            <Button 
              onPress={sendResetLink} 
              disabled={loading} 
              size="lg" 
              className="mt-4 rounded-2xl shadow-lg shadow-primary/20"
            >
              <Text className="text-white font-bold text-lg">
                {loading ? "Sending Link..." : "Send Reset Link"}
              </Text>
            </Button>
          </View>

          <View className="flex-1 justify-end items-center pb-4">
            <Text className="text-muted-foreground">Remember your password? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-primary font-bold mt-1">Back to Login</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}