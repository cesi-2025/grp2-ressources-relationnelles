import { CategoryProvider } from "@/contexts/CategoryContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <CategoryProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </CategoryProvider>
  );
}
