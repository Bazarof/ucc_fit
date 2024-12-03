import CardView from "@/components/CardView";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { View, StyleSheet, Text } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";

export default function Description() {

    const params = useLocalSearchParams();
    const exerciseId = params.id as string;

    useEffect(()=>{

        // Fetch exercise data

    },[]);

    return(<View style={[styles.container]}>
        <ScrollView contentContainerStyle={styles.scrollView}>
            <CardView>
                <View>
                    <Text>{exerciseId}</Text>
                </View>
            </CardView>
        </ScrollView>
    </View>);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        paddingTop: 10,
    }
});