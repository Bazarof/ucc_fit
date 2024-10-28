import { useEffect, useState } from "react";
import { Text } from 'react-native';
import { router } from 'expo-router';
import LoginContent from "@/components/login/LoginContent";
import auth from '@react-native-firebase/auth';
import { useSession } from "@/components/session/SessionProvider";

export default function login() {

  //Context
  const { signIn, setSessionData, session, sessionRole } = useSession();

  //Local state
  const [initializing, setInitializing] = useState(true);
  const [signInError, setSignInError] = useState<string>('');

  // Handle user state changes
  function onAuthStateChanged(user: any) {
    setSessionData(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (!initializing && session !== null) {
      // Redirección basada en el rol
      if (sessionRole === 'student')
        router.replace('/studentDrawer');
      
    }
  }, [initializing, session, sessionRole, router]);

  if (initializing) return null;

  return(
    <>
      <LoginContent onButtonPressed={() => signIn(setSignInError)} signInError={signInError} />
    </>
  );
}