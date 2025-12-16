import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { CheckCircle2, AlertCircle, X } from "lucide-react-native";
import { Button } from "./Button";

interface NotificationModalProps {
  visible: boolean;
  type: "success" | "error";
  title: string;
  message: string;
  onClose: () => void;
}

export function NotificationModal({
  visible,
  type,
  title,
  message,
  onClose,
}: NotificationModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/60 px-6">
        <View className="bg-card w-full max-w-sm rounded-3xl p-6 items-center shadow-2xl">
          {/* Icon Header */}
          <View
            className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${type === "success" ? "bg-green-100" : "bg-red-100"}`}
          >
            {type === "success" ? (
              <CheckCircle2 size={32} className="text-green-600" />
            ) : (
              <AlertCircle size={32} className="text-red-600" />
            )}
          </View>

          {/* Content */}
          <Text className="text-xl font-bold text-foreground mb-2 text-center">
            {title}
          </Text>
          <Text className="text-muted-foreground text-center mb-6 leading-5">
            {message}
          </Text>

          {/* Action Button */}
          <Button
            onPress={onClose}
            className={`w-full rounded-2xl ${type === "success" ? "bg-green-600" : "bg-red-600"}`}
          >
            <Text className="text-white font-bold text-lg">
              {type === "success" ? "Continue" : "Try Again"}
            </Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}
