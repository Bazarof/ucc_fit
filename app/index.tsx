import { useEffect, useState } from "react";
import { router } from 'expo-router';
import { View, Text,Image, StyleSheet} from "react-native";
import AnimatedLoginButton from "../components/animations/AnimatedLoginButton";

// Oauth ID cliente android: 1027066022054-komh5ro0a3n0cnnjq3k8c68udlgdv38j.apps.googleusercontent.com

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
            <Image style={{height: 120, width: 270}} source={require('../assets/images/logo-ucc.png')}/>
            <Text style={styles.title}>UCC Fit</Text>
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
    },
    title: {
        fontWeight: 'bold',
        color: '#525252',
        fontSize: 80,
    }
});