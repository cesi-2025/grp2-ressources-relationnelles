import { ThemedText } from "@/components/ThemedText";
import { useCategory, type SortOption } from "@/contexts/CategoryContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "date", label: "Plus récentes" },
  { value: "title", label: "Titre (A → Z)" },
];

export function CategoryPickerIcon() {
  const colors = useThemeColors();
  const {
    selectedCategoryId,
    setSelectedCategoryId,
    categoryOptions,
    sortBy,
    setSortBy,
  } = useCategory();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Filtres et tri"
        hitSlop={12}
        style={styles.iconHit}
      >
        <Ionicons name="options-outline" size={26} color={colors.gray50} />
      </Pressable>

      <Modal
        visible={open}
        animationType="fade"
        transparent
        onRequestClose={close}
      >
        <View style={styles.modalRoot}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={close}
            accessibilityLabel="Fermer"
          />
          <SafeAreaView
            edges={["bottom"]}
            style={[
              styles.sheet,
              {
                backgroundColor: colors.background,
                borderTopColor: colors.gray200,
              },
            ]}
          >
            <ThemedText
              variant="subtitle1"
              color="foreground"
              style={styles.sectionLabel}
            >
              Catégorie
            </ThemedText>
            {categoryOptions.map((item) => {
              const selected = selectedCategoryId === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    setSelectedCategoryId(item.id);
                    close();
                  }}
                  style={({ pressed }) => [
                    styles.row,
                    { backgroundColor: pressed ? colors.gray100 : "transparent" },
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={item.name}
                >
                  <ThemedText
                    variant="body1"
                    color={selected ? "primary" : "foreground"}
                    style={{ flex: 1, fontWeight: selected ? "600" : "400" }}
                  >
                    {item.name}
                  </ThemedText>
                  {selected ? (
                    <Ionicons name="checkmark" size={22} color={colors.primary} />
                  ) : null}
                </Pressable>
              );
            })}

            <View style={[styles.separator, { backgroundColor: colors.gray200 }]} />

            <ThemedText
              variant="subtitle1"
              color="foreground"
              style={styles.sectionLabel}
            >
              Trier par
            </ThemedText>
            {SORT_OPTIONS.map((opt) => {
              const selected = sortBy === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => {
                    setSortBy(opt.value);
                    close();
                  }}
                  style={({ pressed }) => [
                    styles.row,
                    { backgroundColor: pressed ? colors.gray100 : "transparent" },
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={opt.label}
                >
                  <ThemedText
                    variant="body1"
                    color={selected ? "primary" : "foreground"}
                    style={{ flex: 1, fontWeight: selected ? "600" : "400" }}
                  >
                    {opt.label}
                  </ThemedText>
                  {selected ? (
                    <Ionicons name="checkmark" size={22} color={colors.primary} />
                  ) : null}
                </Pressable>
              );
            })}
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconHit: {
    padding: 4,
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 8,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  sectionLabel: {
    marginBottom: 8,
    marginHorizontal: 8,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 10,
    marginHorizontal: 8,
  },
});
