/* eslint-disable @typescript-eslint/no-require-imports */
import { PortalHost } from '@rn-primitives/portal';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import Toast from 'react-native-toast-message';

import '~/styles/global.css';

import AuthProvider from '~/context/AuthProvider';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isFontsLoaded, fontsLoadingError] = useFonts({
    'Poppins-Black': require('../assets/fonts/Poppins-Black.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-ExtraLight': require('../assets/fonts/Poppins-ExtraLight.ttf'),
    'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Thin': require('../assets/fonts/Poppins-Thin.ttf'),
  });

  useEffect(() => {
    if (fontsLoadingError) throw fontsLoadingError;

    if (isFontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isFontsLoaded, fontsLoadingError]);

  if (!isFontsLoaded) return null;

  return (
    <AuthProvider>
      <MenuProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </MenuProvider>

      <PortalHost />

      <Toast />
    </AuthProvider>
  );
}
