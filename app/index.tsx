import { useEffect, useState } from "react";
import { router } from 'expo-router';
import { View, Text,Image, StyleSheet} from "react-native";
import AnimatedLoginButton from "../components/animations/AnimatedLoginButton";

export default function login(){
    
    const [isLogged, setIsLogged] = useState(false);

    function handleLogIn(){
        setIsLogged(true);
    }

    useEffect(()=>{

        if(isLogged) router.replace('/(studentDrawer)/home');

    },[isLogged]);

    return <LoginContent handleLogIn={handleLogIn}/>;
}

const LoginContent = ({handleLogIn}:{handleLogIn: ()=> void}) => {
    return(<>
        <View style={styles.container}>
            <Image source={require('../assets/images/logo-ucc.png')}/>
            <LoginButton handleLogIn={handleLogIn}/>
        </View>
    </>);
};

const LoginButton = ({handleLogIn}:{handleLogIn: ()=> void}) => {
    return (
        <AnimatedLoginButton handleLogIn={handleLogIn}>
            <Image style={styles.google_icon} source={require('../assets/images/icons/google.png')} />
            <Text style={styles.text_button}>Iniciar sesión</Text>
        </AnimatedLoginButton>);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    google_icon: {
        width: 30,
        height: 30,
        marginEnd: 14 
    },
    text_button: {
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    }
});