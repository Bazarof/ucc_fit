import { useEffect, useState } from "react";
import { Text } from "react-native";
import { router } from "expo-router";
import LoginContent from "@/components/login/LoginContent";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useSession } from "@/components/session/SessionProvider";
import { User } from "@/types/User";
import { getUser } from "@/services/userService";

export default function login() {
  //Context
  const { signIn, setSessionData, session, sessionRole } = useSession();

  //Local state
  const [initializing, setInitializing] = useState(true);
  const [signInError, setSignInError] = useState<string>("");

  // Handle user state changes
  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    // TODO: Handle session expiry
    console.log("ON AUTH STATE CHANGED", user);

    // const a = user?.campus;

    getUser(user?.uid as string).then((user: User) => {
      console.log("USER", user);
      // return user;
      console.log("[Firestore@index]", user);

      setSessionData(user);
    });

    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (!initializing && session !== null) {
      // Redirección basada en el rol
      console.log("GOING TO STUDENT DRAWER WITH USER", session);

      if (session) {
        switch (session.role) {
          case "student":
            router.replace("/studentDrawer");
            break;
          case "admin":
            router.replace("/adminDrawer");
            break;
          // case "coach":
          //   router.replace("/coachDrawer");
          //   break;
          // case "nutritionist":
          //   router.replace("/nutritionistDrawer");
          //   break;
          // default:
          //   router.replace("/login");
        }
      }

      // if (session && session.role === "student")router.replace("/studentDrawer");
    }
  }, [initializing, session, sessionRole, router]);

  if (initializing) return null;

  return (
    <>
      <LoginContent
        onButtonPressed={() => signIn(setSignInError)}
        signInError={signInError}
      />
    </>
  );
}
