import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } from "@react-native-google-signin/google-signin";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import auth from '@react-native-firebase/auth';
import { router } from "expo-router";

const AuthContext = createContext<{
    signIn: (setErrorMessage: React.Dispatch<React.SetStateAction<string>>) => Promise<any>;
    signOut: () => Promise<void>;
    setSessionData: (session: any) => void;
    session?: any | null;
    sessionRole?: string | null;
}>({
    signIn: async () => undefined,
    signOut: async () => {},
    setSessionData: ()=>{},
    session: null,
    sessionRole: null,
});

export function useSession() {
    return useContext(AuthContext);
}

export function SessionProvider({children}:PropsWithChildren){
    GoogleSignin.configure({
        webClientId: '1008981922683-jr7dplm8uher56f4qn3rf7e595bmgb3r.apps.googleusercontent.com',
    });

    // Global session variables
    const [session, setSession] = useState(null);
    const [sessionRole, setSessionRole] = useState<string | null>(null);

    function setSessionData(session: any) {
        
        setSession(session);

        if(session !== null)
            setSessionRole(determineRole(session.email));
    }

    function determineRole(email: string) {

        const studentRegex = /^[0-9]+@ucc\.mx$/;

        return studentRegex.test(email) ? 'student' : 'coach';
    }

    function isUccDomain(email: string) {
        const regex = /^[a-zA-Z0-9._%+-]+@ucc\.mx$/;
        return regex.test(email);
    }

    async function handleSignIn(setErrorMessage: React.Dispatch<React.SetStateAction<string>>) {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const response = await GoogleSignin.signIn();

            if(isSuccessResponse(response)) {
                console.log('response: ', response);
    
                //validate ucc domain
                if(isUccDomain(response.data.user.email)) {
    
                    const googleCredential = auth.GoogleAuthProvider.credential(response.data?.idToken);
    
                    return auth().signInWithCredential(googleCredential);
    
                }else{
                    
            console.error("f");
                    //show modal or dialog box
                    setErrorMessage('Utiliza tu cuenta institucional.');
                    await GoogleSignin.signOut();
                }
    
            }else{
                // signin was cancelled
            }
    
        } catch (error: Error | any) {
            console.error(error.message);
            handleSignInError(error);
    
        }
    }

    async function handleSignOut(){
        try{
            await GoogleSignin.signOut();
            await auth().signOut();
            router.replace('/');
        }catch(error){

        }
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

    return (
        <AuthContext.Provider
            value={{
                signIn: handleSignIn,
                signOut: handleSignOut,
                setSessionData: setSessionData, 
                session: session,
                sessionRole: sessionRole,
            }}>
            {children}
        </AuthContext.Provider>
    );
}