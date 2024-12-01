import { StyleSheet, View } from "react-native";

export default function IntensityIcon({intensity}:{intensity:number}) {
    return (
        <View style={styles.container}>
            <View style={[styles.lowBar]}></View>
            <View style={[styles.mediumBar, {backgroundColor: intensity > 1 ? 'black' : 'none'}]}></View>
            <View style={[styles.highBar, {backgroundColor: intensity > 2 ? 'black' : 'none'}]}></View>
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
        borderColor: 'black',
        borderWidth: 2
    },
    mediumBar: {
        width: 10,
        height: '60%',   
        marginEnd: 5,
        borderColor: 'black',
        borderWidth: 2
    },
    lowBar: {
        width: 10,
        height: '30%',
        marginEnd: 5,
        borderColor: 'black',
        backgroundColor: 'black',
        borderWidth: 2
    }
});