import { TouchableOpacity } from "react-native";
import { Check } from "lucide-react-native";
import { styled } from "nativewind";

const StyledTouch = styled(TouchableOpacity);

export function Checkbox({ checked, onCheckedChange, className }: any) {
  return (
    <StyledTouch
      onPress={() => onCheckedChange(!checked)}
      className={`h-5 w-5 border border-primary rounded items-center justify-center ${
        checked ? "bg-primary" : "bg-transparent"
      } ${className}`}
    >
      {checked && <Check size={14} color="white" />}
    </StyledTouch>
  );
}
