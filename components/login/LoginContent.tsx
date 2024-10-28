import { View, Text, Image, StyleSheet } from 'react-native';
import LoginButton from './LoginButton';

const LoginContent = ({onButtonPressed, signInError}:{onButtonPressed: ()=> void, signInError: string}) => {
    return(<>
        <View style={styles.container}>
            <Image style={{height: 120, width: 270}} source={require('../../assets/images/logo-ucc.png')}/>
            <Text style={styles.title}>UCC Fit</Text>
            <LoginButton handleLogIn={onButtonPressed}/>
            {signInError !== '' ? <Text style={styles.errorMessage}>{signInError}</Text> : null}
        </View>
    </>);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontWeight: 'bold',
        color: '#525252',
        fontSize: 80,
    },
    errorMessage: {
        color: 'red',
        fontSize: 18
    }
});

export default LoginContent;