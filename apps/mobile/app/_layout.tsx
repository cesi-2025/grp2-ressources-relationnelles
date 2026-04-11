import { GlobalBottomNav } from "@/components/GlobalBottomNav";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { FooterScrollProvider } from "@/contexts/FooterScrollContext";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function RootLayout() {
  return (
    <CategoryProvider>
      <FooterScrollProvider>
        <View style={styles.root}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
          <GlobalBottomNav />
        </View>
      </FooterScrollProvider>
    </CategoryProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
