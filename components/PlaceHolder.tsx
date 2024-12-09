import { View, Text } from "react-native";

export default function PlaceHolder() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'gray' }}>Próximamente</Text>
        </View>
    );
}