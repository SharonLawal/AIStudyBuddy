import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Link } from "expo-router";
import { supabase } from "../../libs/supabase";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import {
  Mail,
  Lock,
  User,
  GraduationCap,
  ArrowRight,
  Check,
  X,
} from "lucide-react-native";
import { useNotification } from "../../providers/NotificationProvider";
import { useColorScheme } from "nativewind";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showNotification } = useNotification();

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#94a3b8" : "#64748b";

  // Password Validation State
  const [validations, setValidations] = useState({
    minLength: false,
    hasNumber: false,
    hasUpper: false,
    hasSpecial: false,
  });

  // Run validation whenever password changes
  useEffect(() => {
    setValidations({
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  const isPasswordValid = Object.values(validations).every(Boolean);

  async function signUpWithEmail() {
    if (!name || !email || !password) {
      showNotification("error", "Missing Fields", "Please fill in all fields");
      return;
    }

    if (!isPasswordValid) {
      showNotification(
        "error",
        "Weak Password",
        "Please ensure your password meets all requirements."
      );
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

    if (error) {
      showNotification("error", "Error", error.message);
    } else {
      showNotification(
        "success",
        "Success",
        "Account created! Please verify your email."
      );
      router.replace("/(auth)/login");
    }
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
          <View className="items-center mb-8">
            <View className="w-16 h-16 bg-secondary/10 rounded-2xl items-center justify-center mb-4">
              <GraduationCap size={32} color="#0ea5e9" />
            </View>
            <Text className="text-3xl font-bold text-foreground mb-2">
              Create Account
            </Text>
            <Text className="text-muted-foreground text-center">
              Join AI Study Buddy today
            </Text>
          </View>

          <View className="gap-5">
            <View>
              <Text className="text-foreground font-medium mb-2 ml-1">
                Full Name
              </Text>
              <Input
                placeholder="John Doe"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                icon={<User size={20} color={iconColor} />}
              />
            </View>

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
                icon={<Mail size={20} color={iconColor} />}
              />
            </View>

            <View>
              <Text className="text-foreground font-medium mb-2 ml-1">
                Password
              </Text>
              <Input
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                icon={<Lock size={20} color={iconColor} />}
              />

              {/* Validation Checklist */}
              {password.length > 0 && (
                <View className="mt-3 flex-row flex-wrap gap-2">
                  <ValidationItem
                    label="8+ chars"
                    isValid={validations.minLength}
                  />
                  <ValidationItem
                    label="Number"
                    isValid={validations.hasNumber}
                  />
                  <ValidationItem
                    label="Uppercase"
                    isValid={validations.hasUpper}
                  />
                  <ValidationItem
                    label="Special char"
                    isValid={validations.hasSpecial}
                  />
                </View>
              )}
            </View>

            <Button
              onPress={signUpWithEmail}
              disabled={loading || (password.length > 0 && !isPasswordValid)}
              size="lg"
              className={`mt-4 rounded-2xl shadow-lg shadow-secondary/20 bg-[#0ea5e9] ${!isPasswordValid && password.length > 0 ? "opacity-50" : ""}`}
            >
              <Text className="text-white font-bold text-lg">
                {loading ? "Creating Account..." : "Sign Up"}
              </Text>
              {!loading && (
                <ArrowRight size={20} color="white" className="ml-2" />
              )}
            </Button>
          </View>

          <View className="flex-row justify-center mt-8 pb-4">
            <Text className="text-muted-foreground">
              Already have an account?{" "}
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-secondary font-bold">Log In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Helper component for validation pills
function ValidationItem({
  label,
  isValid,
}: {
  label: string;
  isValid: boolean;
}) {
  return (
    <View
      className={`flex-row items-center px-2 py-1 rounded-md border ${isValid ? "bg-green-500/10 border-green-500/20" : "bg-muted border-transparent"}`}
    >
      {isValid ? (
        <Check size={12} className="text-green-600 mr-1" />
      ) : (
        <X size={12} className="text-muted-foreground mr-1" />
      )}
      <Text
        className={`text-xs ${isValid ? "text-green-700 font-medium" : "text-muted-foreground"}`}
      >
        {label}
      </Text>
    </View>
  );
}
