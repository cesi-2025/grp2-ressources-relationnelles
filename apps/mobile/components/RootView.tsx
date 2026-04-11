import { useThemeColors } from "@/hooks/useThemeColors";
import { ViewProps, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = ViewProps & {
  backgroundColor?: string;
};

export function RootView({ style, backgroundColor, ...rest }: Props) {
  const colors = useThemeColors();
  return (
    <SafeAreaView
      style={[
        rootStyle,
        { backgroundColor: backgroundColor ?? colors.gray50 },
        style,
      ]}
      {...rest}
    />
  );
}

const rootStyle = {
  flex: 1,
  padding: 4,
} satisfies ViewStyle;
