import { View, Text } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <StyledView
      className={`bg-slate-900 rounded-xl border border-slate-800 shadow-sm ${className}`}
    >
      {children}
    </StyledView>
  );
}

export function CardHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <StyledView className={`p-6 pb-4 ${className}`}>{children}</StyledView>
  );
}

export function CardTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <StyledText
      className={`text-lg font-semibold text-slate-100 leading-none ${className}`}
    >
      {children}
    </StyledText>
  );
}

export function CardDescription({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <StyledText className={`text-sm text-slate-400 mt-1 ${className}`}>
      {children}
    </StyledText>
  );
}

export function CardContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <StyledView className={`p-6 pt-0 ${className}`}>{children}</StyledView>
  );
}
