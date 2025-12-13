import { View, Text, Image } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

export function Avatar({ className, children }: any) {
  return (
    <StyledView
      className={`h-10 w-10 rounded-full overflow-hidden bg-muted justify-center items-center ${className}`}
    >
      {children}
    </StyledView>
  );
}

export function AvatarImage({ src }: { src: any }) {
  return <StyledImage source={src} className="h-full w-full" />;
}

export function AvatarFallback({ children, className }: any) {
  return (
    <StyledView
      className={`h-full w-full justify-center items-center bg-muted ${className}`}
    >
      <StyledText className="text-muted-foreground">{children}</StyledText>
    </StyledView>
  );
}
