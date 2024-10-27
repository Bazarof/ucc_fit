import AnimatedLoginButton from "../animations/AnimatedLoginButton";
import {Text, Image, StyleSheet } from 'react-native';

const LoginButton = ({handleLogIn}:{handleLogIn: ()=> void}) => {
    return (
        <AnimatedLoginButton handleLogIn={handleLogIn}>
            <Image style={styles.google_icon} source={require('../assets/images/icons/google.png')} />
            <Text style={styles.text_button}>Iniciar sesión</Text>
        </AnimatedLoginButton>);
}

const styles = StyleSheet.create({
    
    google_icon: {
        width: 30,
        height: 30,
        marginEnd: 14 
    },
    text_button: {
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LoginButton;