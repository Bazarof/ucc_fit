import { useEffect, useState } from "react";
import { Redirect, router } from 'expo-router';
import LoginContent from "@/components/login/LoginContent";
import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

export default function login(){

    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState('');

    const routes = ['/studentDrawer', '/coachDrawer', '/nutritionistDrawer'];

    GoogleSignin.configure({
        webClientId: '1008981922683-jr7dplm8uher56f4qn3rf7e595bmgb3r.apps.googleusercontent.com',
    });

    // Handle user state changes
    function onAuthStateChanged(user: any) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
      }, []);

      if(initializing) return null;

      if(user !== null){

        // routes based on user role
        router.replace('/studentDrawer');
        return null;
      }

    return <LoginContent onButtonPressed={handleSignIn}/>;
}

async function handleSignIn() {
    try{
        await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
        const response = await GoogleSignin.signIn();

        if(isSuccessResponse(response)) {
            console.log('response: ', response);

            //validate ucc domain
            if(isUccDomain(response.data.user.email)) {

                const googleCredential = auth.GoogleAuthProvider.credential(response.data?.idToken);

                return auth().signInWithCredential(googleCredential);

            }else{
                //show modal or dialog box
                await GoogleSignin.signOut();
            }

        }else{
            // signin was cancelled
        }

    } catch (error) {
        
        handleSignInError(error);

    }
}

function isUccDomain(email: string) {
    const regex = /^[a-zA-Z0-9._%+-]+@ucc\.mx$/;
    return regex.test(email);
}

function handleSignInError(error: any) {
    if (isErrorWithCode(error)) {
        switch (error.code) {
            case statusCodes.IN_PROGRESS:
                // operation (eg. sign in) already in progress
                break;
            case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                // Android only, play services not available or outdated
                break;
            default:
            // some other error happened
        }
    } else {
        // an error that's not related to google sign in occurred
    }
}