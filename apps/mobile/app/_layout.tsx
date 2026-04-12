import { GlobalBottomNav } from "@/components/GlobalBottomNav";
import { AuthProvider } from "@/contexts/AuthContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { FooterScrollProvider } from "@/contexts/FooterScrollContext";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function RootLayout() {
  return (
    <CategoryProvider>
      <AuthProvider>
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
      </AuthProvider>
    </CategoryProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
