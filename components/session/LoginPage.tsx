import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginPage({children}:{children: React.ReactNode}){
    
    const [isLogged, setIsLogged] = useState(false);

    return (
        <>
            {!isLogged ? <LoginContent/> : children}
        </>
    );
}

const LoginContent = () => {
    return(<>
        <SafeAreaView>
            <Text style={styles.phrase}>This is the log-in page</Text>
        </SafeAreaView>
    </>);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    phrase: {
        fontSize: 30,
    }
});