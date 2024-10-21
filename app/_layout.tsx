import * as Font from 'expo-font';
import AnimatedAppLoader from "../components/splash/AnimatedAppLoader";
import LoginPage from '@/components/session/LoginPage';
import { Stack } from 'expo-router';
import { enableScreens } from 'react-native-screens';
enableScreens(true);
// Keep the splash screen visible while we fetch resources
//SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  return (
    <AnimatedAppLoader>
      <LoginPage>
          <Stack>
            <Stack.Screen name='(drawer)' options={{headerShown: false,}}/>
          </Stack>
      </LoginPage>
    </AnimatedAppLoader>
  );
}