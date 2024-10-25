import * as Font from 'expo-font';
import AnimatedAppLoader from "../components/splash/AnimatedAppLoader";
import LoginPage from '@/app';
import { Stack } from 'expo-router';
import { enableScreens } from 'react-native-screens';
enableScreens(true);
// Keep the splash screen visible while we fetch resources
//SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  return (
    <AnimatedAppLoader>
      <Stack>
        <Stack.Screen name='index' options={{headerShown: false, }} />
        <Stack.Screen name='(studentDrawer)' options={{ headerShown: false, }} />
      </Stack>
    </AnimatedAppLoader>
  );
}