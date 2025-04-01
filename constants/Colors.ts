/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: {
      primary: '#000000',
      secondary: '#333333',
      muted: '#666666',
      inverse: '#FFFFFF',
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F0F0F0',
      tertiary: '#E5E5E5',
    },
    tint: '#007AFF',
    accent: {
      primary: '#007AFF',
      secondary: '#5856D6',
    },
    error: {
      primary: '#FF3B30',
      background: '#FFF5F5',
      text: '#FF3B30',
    },
    icon: '#000000',
    border: '#E0E0E0',
    gradient: {
      start: '#007AFF',
      end: '#5856D6'
    },
    tabIconDefault: '#687076',
    tabIconSelected: '#007AFF',
  },
  dark: {
    text: {
      primary: '#FFFFFF',
      secondary: '#E0E0E0',
      muted: '#A0A0A0',
      inverse: '#000000',
    },
    background: {
      primary: '#000000',
      secondary: '#1A1A1A',
      tertiary: '#2D2D2D',
    },
    tint: '#0A84FF',
    accent: {
      primary: '#0A84FF',
      secondary: '#5E5CE6',
    },
    error: {
      primary: '#FF453A',
      background: '#2D1F1F',
      text: '#FF453A',
    },
    icon: '#FFFFFF',
    border: '#2D2D2D',
    gradient: {
      start: '#0A84FF',
      end: '#5E5CE6'
    },
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#0A84FF',
  },
};
