import { TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  className?: string;
  icon?: React.ReactNode; // New prop for icons
}

export function Input({ className, icon, ...props }: InputProps) {
  return (
    <View className={`flex-row items-center bg-muted/50 rounded-2xl border border-transparent focus:border-primary h-14 px-4 ${className}`}>
      {icon && <View className="mr-3 text-muted-foreground">{icon}</View>}
      
      <TextInput
        placeholderTextColor="#94a3b8" 
        className="flex-1 text-foreground text-base h-full font-medium"
        {...props}
      />
    </View>
  );
}