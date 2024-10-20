import * as Font from 'expo-font';
import AnimatedAppLoader from "../components/splash/AnimatedAppLoader";
import MainScreen from "@/components/MainScreen";
import LoginPage from '@/components/session/LoginPage';

// Keep the splash screen visible while we fetch resources
//SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  return (
      <AnimatedAppLoader>
        <LoginPage>
          <MainScreen/>
        </LoginPage>
      </AnimatedAppLoader>
  );
}