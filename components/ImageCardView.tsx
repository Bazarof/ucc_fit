import { StyleSheet, View } from "react-native";

export default function ImageCardView({children} : {children: any}){
    return(<View style={styles.container}>
        <View style={styles.card}>
            {children}
        </View>
    </View>);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 210,
        width: '100%',
        paddingTop: 10,
        paddingStart: 20,
        paddingEnd: 20,
        marginBottom: 30
    },
    card: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        borderRadius: 20,
        elevation: 2
    }
});