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

  const isHomeHighlighted =
    pathname === "/" ||
    pathname === "/index" ||
    (pathname.startsWith("/resource/") && pathname !== "/resource/create");
  const isHomeActive = pathname === "/" || pathname === "/index";
  const isCreate = pathname === "/resource/create";
  const isDashboard = pathname === "/dashboard";
  const isProfileHighlighted =
    pathname === "/profile" ||
    pathname === "/login" ||
    pathname === "/register";
  const isProfileActive = isLoggedIn
    ? pathname === "/profile"
    : pathname === "/login" || pathname === "/register";

  const iconHome = isHomeHighlighted ? colors.foreground : colors.gray500;
  const iconCreate = isCreate ? colors.foreground : colors.gray500;
  const iconDashboard = isDashboard ? colors.foreground : colors.gray500;
  const iconProfile = isProfileHighlighted ? colors.foreground : colors.gray500;

  const goHome = useCallback(() => {
    if (pathname === "/" || pathname === "/index") return;
    router.replace({ pathname: "/" });
  }, [pathname]);
  const goCreate = useCallback(() => {
    if (pathname === "/resource/create") return;
    router.push({ pathname: "/resource/create" });
  }, [pathname]);
  const goDashboard = useCallback(() => {
    if (pathname === "/dashboard") return;
    router.push({ pathname: "/dashboard" });
  }, [pathname]);
  const goProfile = useCallback(() => {
    if (isLoggedIn) {
      if (pathname === "/profile") return;
      router.push({ pathname: "/profile" });
    } else {
      if (pathname === "/login" || pathname === "/register") return;
      router.push({ pathname: "/login" });
    }
  }, [isLoggedIn, pathname]);

  return (
    <View style={styles.shell} pointerEvents="box-none">
      <Animated.View style={footerAnimatedStyle}>
        <Footer>
          <FooterNavItem
            accessibilityLabel="Accueil"
            accessibilityState={{ selected: isHomeActive, disabled: isHomeActive }}
            disabled={isHomeActive}
            onPress={goHome}
          >
            <Ionicons name="home" size={26} color={iconHome} />
          </FooterNavItem>
          {isLoggedIn ? (
            <FooterNavItem
              accessibilityLabel="Créer une ressource"
              accessibilityState={{ selected: isCreate, disabled: isCreate }}
              disabled={isCreate}
              onPress={goCreate}
            >
              <Ionicons name="add-circle-outline" size={26} color={iconCreate} />
            </FooterNavItem>
          ) : null}
          {isLoggedIn ? (
            <FooterNavItem
              accessibilityLabel="Tableau de bord"
              accessibilityState={{ selected: isDashboard, disabled: isDashboard }}
              disabled={isDashboard}
              onPress={goDashboard}
            >
              <Ionicons name="speedometer-outline" size={26} color={iconDashboard} />
            </FooterNavItem>
          ) : null}
          <FooterNavItem
            accessibilityLabel="Mon profil"
            accessibilityState={{ selected: isProfileActive, disabled: isProfileActive }}
            disabled={isProfileActive}
            onPress={goProfile}
          >
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
