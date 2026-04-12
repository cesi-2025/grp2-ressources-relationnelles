import { Footer, FooterNavItem } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useFooterScroll } from "@/contexts/FooterScrollContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, usePathname } from "expo-router";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

export function GlobalBottomNav() {
  const colors = useThemeColors();
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();
  const { footerAnimatedStyle } = useFooterScroll();

  const isHome =
    pathname === "/" ||
    pathname === "/index" ||
    (pathname.startsWith("/resource/") && pathname !== "/resource/create");
  const isCreate = pathname === "/resource/create";
  const isDashboard = pathname === "/dashboard";
  const isProfile = pathname === "/profile" || pathname === "/login";

  const iconHome = isHome ? colors.foreground : colors.gray500;
  const iconCreate = isCreate ? colors.foreground : colors.gray500;
  const iconDash = isDashboard ? colors.foreground : colors.gray500;
  const iconProfile = isProfile ? colors.foreground : colors.gray500;

  const goHome = useCallback(() => router.replace({ pathname: "/" }), []);
  const goCreate = useCallback(() => router.push({ pathname: "/resource/create" }), []);
  const goDashboard = useCallback(() => router.push({ pathname: "/dashboard" }), []);
  const goProfile = useCallback(() => {
    if (isLoggedIn) router.push({ pathname: "/profile" });
    else router.push({ pathname: "/login" });
  }, [isLoggedIn]);

  return (
    <View style={styles.shell} pointerEvents="box-none">
      <Animated.View style={footerAnimatedStyle}>
        <Footer>
          <FooterNavItem accessibilityLabel="Accueil" onPress={goHome}>
            <Ionicons name="home" size={26} color={iconHome} />
          </FooterNavItem>
          <FooterNavItem accessibilityLabel="Créer une ressource" onPress={goCreate}>
            <Ionicons name="add-circle-outline" size={26} color={iconCreate} />
          </FooterNavItem>
          <FooterNavItem accessibilityLabel="Tableau de bord" onPress={goDashboard}>
            <Ionicons name="stats-chart-outline" size={26} color={iconDash} />
          </FooterNavItem>
          <FooterNavItem accessibilityLabel="Mon profil" onPress={goProfile}>
            <Ionicons name="person" size={26} color={iconProfile} />
          </FooterNavItem>
        </Footer>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
});
