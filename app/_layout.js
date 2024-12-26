import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Correct stack navigator
import { useColorScheme } from '@/hooks/useColorScheme';
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import ViewPage from './pages/ViewPage';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator(); // Correct stack creation

function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashPage} />
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="View" component={ViewPage} />

    </Stack.Navigator>
  );
}

export default function RootLayout({ children }) {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null; // Wait until the font is loaded
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Wrap everything inside without another NavigationContainer */}
      {children} {/* expo-router automatically handles the navigation */}
      <AppNavigator/>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
