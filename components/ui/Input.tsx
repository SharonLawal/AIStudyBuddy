import { TextInput } from "react-native";
import { styled } from "nativewind";

const StyledInput = styled(TextInput);

export function Input({
  className,
  ...props
}: React.ComponentProps<typeof TextInput>) {
  return (
    <StyledInput
      placeholderTextColor="#94a3b8"
      className={`flex h-10 w-full rounded-md border border-slate-800 bg-transparent px-3 py-2 text-sm text-slate-100 ${className}`}
      {...props}
    />
  );
}
