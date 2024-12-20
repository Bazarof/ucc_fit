import { StyleSheet, View, Text } from "react-native";

export default function CardView({children} : {children: any}) {
    return(<>
        <View style={styles.container}>
            <View style={styles.card}>
                {children}
            </View>
        </View>
    </>);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        paddingTop: 10,
        paddingStart: 20,
        paddingEnd: 20,
        paddingBottom: 10,
    },
    card: {
        borderRadius: 20,
        backgroundColor: 'white',
        padding: 20,
        width: '100%',
        alignItems: 'flex-start',
        elevation: 2,
    }
});