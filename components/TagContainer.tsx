import {StyleSheet, View, Text } from "react-native";

export default function TagContainer({text}: {text: string}) {
    return(<View style={styles.container}>
        <Text style={styles.text}>{text}</Text>
    </View>);
}

const styles = StyleSheet.create({
    container: {
        padding: 5,
        borderRadius: 10,
        backgroundColor: '#007FAF',
    },
    text: {
        color: 'white',
    }
});