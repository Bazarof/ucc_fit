import { StyleSheet, View } from "react-native";

export default function LevelIcon() {
    return (
        <View style={styles.container}>
            <View style={styles.lowBar}></View>
            <View style={styles.mediumBar}></View>
            <View style={styles.highBar}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    highBar: {
        width: 10,
        height: '100%',   
        borderColor: 'gray',
        backgroundColor: 'gray',
        borderWidth: 2
    },
    mediumBar: {
        width: 10,
        height: '60%',   
        marginEnd: 5,
        borderColor: 'gray',
        backgroundColor: 'gray',
        borderWidth: 2
    },
    lowBar: {
        width: 10,
        height: '30%',
        marginEnd: 5,
        borderColor: 'gray',
        backgroundColor: 'gray',
        borderWidth: 2
    }
});