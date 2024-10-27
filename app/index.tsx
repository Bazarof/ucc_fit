import { useEffect, useState } from "react";
import { router } from 'expo-router';
import LoginContent from "@/components/login/LoginContent";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function login(){

    const [isLogged, setIsLogged] = useState(false);

    function handleLogIn(){
        setIsLogged(true);
    }


    useEffect(()=>{
        if(isLogged) router.replace('/studentDrawer');
    }, [isLogged]);

    return <LoginContent onButtonPressed={handleLogIn}/>;
}