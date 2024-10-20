import * as Font from 'expo-font';
import AnimatedAppLoader from "@/components/AnimatedAppLoader";
import MainScreen from "@/components/MainScreen";

// Keep the splash screen visible while we fetch resources
//SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  return (
      <AnimatedAppLoader>
        <MainScreen />
      </AnimatedAppLoader>
  );
}