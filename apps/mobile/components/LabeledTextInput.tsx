import { ThemedText } from "@/components/ThemedText";
import { inputStyles } from "@/constants/styles";
import { useThemeColors } from "@/hooks/useThemeColors";
import {
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";

type LabeledTextInputProps = Omit<TextInputProps, "style"> & {
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export function LabeledTextInput({
  label,
  containerStyle,
  labelStyle,
  inputStyle,
  placeholderTextColor,
  ...rest
}: LabeledTextInputProps) {
  const colors = useThemeColors();

  return (
    <View style={containerStyle}>
      <ThemedText variant="subtitle2" color="gray600" style={labelStyle}>
        {label}
      </ThemedText>
      <TextInput
        placeholderTextColor={placeholderTextColor ?? colors.gray400}
        style={[
          inputStyles.base,
          { borderColor: colors.gray200, color: colors.foreground },
          inputStyle,
        ]}
        {...rest}
      />
    </View>
  );
}
