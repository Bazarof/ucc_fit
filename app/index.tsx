import { useEffect, useState } from "react";
import { router } from 'expo-router';
import LoginContent from "@/components/login/LoginContent";
import auth from '@react-native-firebase/auth';
import { useSession } from "@/components/session/SessionProvider";

export default function login(){
    
    //Context
    const {signIn, setSessionData, session, sessionRole} = useSession();

    //Local state
    const [initializing, setInitializing] = useState(true);

    //const routes = ['/studentDrawer', '/coachDrawer', '/nutritionistDrawer'];

    // Handle user state changes
    function onAuthStateChanged(user: any) {
        setSessionData(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
      }, []);

      if(initializing) return null;

      if(session !== null){

        // routes based on user role
        //if(sessionRole === 'student')
            router.replace('/studentDrawer');

        //if(sessionRole === 'coach')
        //    router.replace('/coachDrawer');
        //if(sessionRole === 'student')
        //    router.replace('/studentDrawer');
        return null;
      }

    return <LoginContent onButtonPressed={signIn}/>;
}