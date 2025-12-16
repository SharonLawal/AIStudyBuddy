import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { supabase } from "../../libs/supabase";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Mail, Lock, GraduationCap, ArrowRight } from "lucide-react-native";
import { useNotification } from '../../providers/NotificationProvider';

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) showNotification('error', 'Login Failed', error.message);
    setLoading(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          className="p-8"
        >
          {/* Header Section */}
          <View className="items-center mb-12">
            <View className="w-20 h-20 bg-primary/10 rounded-3xl items-center justify-center mb-6 shadow-sm">
              <GraduationCap size={40} className="text-primary" />
            </View>
            <Text className="text-4xl font-bold text-foreground mb-2">
              Welcome Back
            </Text>
            <Text className="text-muted-foreground text-center text-base">
              Sign in to continue your learning journey
            </Text>
          </View>

          {/* Form Section */}
          <View className="gap-5">
            <View>
              <Text className="text-foreground font-medium mb-2 ml-1">
                Email
              </Text>
              <Input
                placeholder="student@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                icon={<Mail size={20} color="#94a3b8" />}
              />
            </View>

            <View>
              <Text className="text-foreground font-medium mb-2 ml-1">
                Password
              </Text>
              <Input
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                icon={<Lock size={20} color="#94a3b8" />}
              />
            </View>

            <Link href="/(auth)/forgot-password" asChild>
              <TouchableOpacity className="self-end">
                <Text className="text-primary font-semibold text-sm">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </Link>

            <Button
              onPress={signInWithEmail}
              disabled={loading}
              size="lg"
              className="mt-4 rounded-2xl shadow-lg shadow-primary/20"
            >
              <Text className="text-white font-bold text-lg">
                {loading ? "Signing in..." : "Sign In"}
              </Text>
              {!loading && (
                <ArrowRight size={20} color="white" className="ml-2" />
              )}
            </Button>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mt-10">
            <Text className="text-muted-foreground">
              Don't have an account?{" "}
            </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text className="text-primary font-bold">Create Account</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
