import AnimatedAppLoader from "../components/splash/AnimatedAppLoader";
import { Stack } from 'expo-router';
import { enableScreens } from 'react-native-screens';
import { SessionProvider, useSession } from '@/components/session/SessionProvider';
import { PaperProvider } from 'react-native-paper';
import { useEffect, useState } from 'react';
import NfcManager from "react-native-nfc-manager";
enableScreens(true);
// Keep the splash screen visible while we fetch resources
//SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [hasNfc, setHasNfc] = useState<boolean | null>(null);

  useEffect(()=>{
    
    async function checkNfc(){
      const supported = await NfcManager.isSupported();
      if(supported){
        await NfcManager.start();
      }
      setHasNfc(supported);
    }

    checkNfc();

  },[]);

  if(hasNfc === null){
    return null;
  }//else if(!hasNfc){
    // Set other type of check attendance
  //}

  return (
    <AnimatedAppLoader>
      <SessionProvider>
        <PaperProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="studentDrawer"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="adminDrawer" options={{ headerShown: false }} />
            <Stack.Screen
              name="trainerDrawer"
              options={{ headerShown: false }}
            />
          </Stack>
        </PaperProvider>
      </SessionProvider>
    </AnimatedAppLoader>
  );
}