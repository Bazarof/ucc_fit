import ButtonOption from "@/components/ButtonOption";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from '@react-native-firebase/auth';
import { router, useRouter } from "expo-router";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function configuracion() {

    const router = useRouter();

    async function handleSignOut(){
        try{
            await GoogleSignin.signOut();
            await auth().signOut();
            router.replace('/');
        }catch(error){

        }
    }

    return <ScrollView style={styles.container_scroll}>
        <View style={styles.scroll_item_style}>
            <ButtonOption
                button_style={styles.button_style}
                text_style={styles.text_style}
                title='Cerrar sesión'
                action={handleSignOut}/>
        </View>
    </ScrollView>
}

const styles = StyleSheet.create({
    container_scroll: {
        flex: 1,
    },
    button_style: {
        width: '90%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3,
    },
    scroll_item_style: {
        paddingTop: 20,
        paddingBottom: 20,
        alignItems: 'center',
    },
    text_style: {
        alignSelf: 'center',
        fontSize: 25,
        fontWeight: 'bold',
    }
});