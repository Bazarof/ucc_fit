import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function MainScreen(){
    return (<SafeAreaProvider>
        <Stack>
            <Stack.Screen name="index" options={{ title: "Home" }} />
            <Stack.Screen name="about" options={{ title: "About" }} />
        </Stack>
    </SafeAreaProvider>
    );
}