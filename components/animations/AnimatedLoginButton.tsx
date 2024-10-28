import { useRef } from "react"
import { Animated, Pressable, StyleSheet } from "react-native";

export default function AnimatedLoginButton({children, handleLogIn}:{children: React.ReactNode, handleLogIn: () => void}){
    
    const opacity = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.timing(opacity,{
            toValue: 0.5,
            duration: 100,
            useNativeDriver: true,
        }).start()
    }

    const handlePressOut = () => {
        Animated.timing(opacity,{
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start()
        
    }
    
    return(
        <Animated.View style={[{opacity}, styles.button_login1]}>
            <Pressable style={styles.button_content} onPress={handleLogIn}  onPressIn={handlePressIn} onPressOut={handlePressOut}>
                {children}
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    button_login1: {
        marginTop: 100,
        marginBottom: 30,
        backgroundColor: '#fff',
        borderRadius: 25,
        elevation: 3,
    },
    button_content:{
        padding: 12,
        borderRadius: 25,
        flexDirection: 'row',
    },
});