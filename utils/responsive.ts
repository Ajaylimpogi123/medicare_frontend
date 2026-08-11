import { useWindowDimensions } from "react-native";

// ── RESPONSIVE HOOK (reactive to rotation) ─────────────
export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;

  // better tablet detection (works on Android tablets + iPads)
  const isTablet = Math.min(width, height) >= 600;

  const isSmallDevice = width < 375;

  const guidelineWidth = 375;
  const guidelineHeight = 812;

  const scale = (size: number) => (width / guidelineWidth) * size;

  const verticalScale = (size: number) => (height / guidelineHeight) * size;

  return {
    width,
    height,
    isLandscape,
    isTablet,
    isSmallDevice,
    scale,
    verticalScale,
  };
}
