import { useCallback, useEffect, useState } from "react";
import AnimatedSplashScreen from "./AnimatedSplashScreen";
import { SplashScreen } from "expo-router";
import { View } from "react-native";

export default function AnimatedAppLoader({children}:{children: React.ReactNode}){

    const [isAppReady, setAppReady] = useState(false);

    const onAnimationFinished = useCallback(async () => {
        try {
          //await new Promise(resolve => setTimeout(resolve, 20000));
          await SplashScreen.hideAsync();
          // Load stuff
          await Promise.all([]);
        } catch (e) {
          // handle errors
        } finally {
          setAppReady(true);
        }
      }, []);

    return (
      <>
        {isAppReady ? children : <AnimatedSplashScreen onAnimationFinish={onAnimationFinished}/>}
      </>
    );
}