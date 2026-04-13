import { usePathname } from "expo-router";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import type { ViewStyle } from "react-native";
import {
  type AnimatedStyle,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FOOTER_ROW = 52;
const FOOTER_PADDING_TOP = 8;

function computeFooterHeight(bottomInset: number): number {
  return FOOTER_ROW + FOOTER_PADDING_TOP + Math.max(bottomInset, 8);
}

type FooterScrollContextValue = {
  scrollHandler: ReturnType<typeof useAnimatedScrollHandler>;
  contentInsetBottom: number;
  footerAnimatedStyle: AnimatedStyle<ViewStyle>;
};

const FooterScrollContext = createContext<FooterScrollContextValue | null>(
  null,
);

export function FooterScrollProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);

  const footerTranslate = useSharedValue(0);
  const lastY = useSharedValue(0);
  const hideDistance = useSharedValue(computeFooterHeight(insets.bottom));

  // Gestion de la hauteur du footer.
  useEffect(() => {
    hideDistance.value = computeFooterHeight(insets.bottom);
  }, [insets.bottom, hideDistance]);

  const contentInsetBottom = useMemo(
    () => computeFooterHeight(insets.bottom) + 12,
    [insets.bottom],
  );

  // Gestion du changement de route.
  useEffect(() => {
    if (pathnameRef.current === pathname) {
      return;
    }
    pathnameRef.current = pathname;
    footerTranslate.value = 0;
    lastY.value = 0;
  }, [pathname, footerTranslate, lastY]);

  // Gestion du scroll.
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      const y = e.contentOffset.y;
      const contentH = e.contentSize.height;
      const layoutH = e.layoutMeasurement.height;
      const delta = y - lastY.value;
      lastY.value = y;

      if (y < 8) {
        footerTranslate.value = withTiming(0, { duration: 200 });
        return;
      }

      if (contentH <= layoutH + 40) {
        footerTranslate.value = withTiming(0, { duration: 200 });
        return;
      }

      if (y + layoutH >= contentH - 32) {
        footerTranslate.value = withTiming(hideDistance.value, {
          duration: 220,
        });
        return;
      }

      // Scroll down  -> masquer le footer.
      if (delta > 12) {
        footerTranslate.value = withTiming(hideDistance.value, {
          duration: 220,
        });
        // Scroll up -> afficher le footer.
      } else if (delta < -12) {
        footerTranslate.value = withTiming(0, { duration: 220 });
      }
    },
  });

  const footerAnimatedStyle = useAnimatedStyle<ViewStyle>(() => ({
    transform: [{ translateY: footerTranslate.value }],
  }));

  const value = useMemo(
    () => ({
      scrollHandler,
      contentInsetBottom,
      footerAnimatedStyle,
    }),
    [scrollHandler, contentInsetBottom, footerAnimatedStyle],
  );

  return (
    <FooterScrollContext.Provider value={value}>
      {children}
    </FooterScrollContext.Provider>
  );
}

export function useFooterScroll() {
  const ctx = useContext(FooterScrollContext);
  if (!ctx) {
    throw new Error(
      "useFooterScroll doit être utilisé dans un FooterScrollProvider",
    );
  }
  return ctx;
}
