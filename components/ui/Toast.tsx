import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, Text, Animated } from 'react-native';
import { AlertCircle, CheckCircle2 } from 'lucide-react-native';

type ToastType = 'success' | 'error';

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('success');
  const fadeAnim = useState(new Animated.Value(0))[0];

  const showToast = useCallback((msg: string, t: ToastType) => {
    setMessage(msg);
    setType(t);
    setVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <Animated.View 
          className="absolute top-12 left-4 right-4 z-50 rounded-lg shadow-lg"
          style={{ opacity: fadeAnim }}
        >
          <View className={`flex-row items-center p-4 rounded-lg gap-3 ${type === 'error' ? 'bg-destructive' : 'bg-green-600'}`}>
            {type === 'error' ? <AlertCircle size={20} color="white" /> : <CheckCircle2 size={20} color="white" />}
            <Text className="text-white font-medium flex-1">{message}</Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}