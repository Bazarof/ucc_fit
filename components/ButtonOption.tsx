import { Text, Pressable, ViewStyle } from "react-native";
import { StyleSheet } from "react-native";

interface ButtonOptionProps {
    button_style?: ViewStyle;
    text_style?: ViewStyle;
    title: string;
    action: () => void;
}

export default function ButtonOption(props: ButtonOptionProps){
    return(
        <Pressable style={[props.button_style]} onPress={props.action}>
            <Text style={[props.text_style]}>{props.title}</Text>
        </Pressable>
    );
}
 const styles = StyleSheet.create({
    button: {
        borderRadius: 10
    }
 });