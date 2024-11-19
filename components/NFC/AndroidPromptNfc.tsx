import { transform } from "@babel/core";
import { forwardRef, useState, useEffect, useRef, useImperativeHandle } from "react";
import { View, Text, Modal, StyleSheet, Dimensions, Animated } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button } from "react-native-paper";
import { opacity } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

// Define el tipo para el objeto que será referenciado
export interface AndroidPromptNfcRef {
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setHintText: React.Dispatch<React.SetStateAction<string>>;
  }

const AndroidPromptNfc = (props: any, ref: React.Ref<AndroidPromptNfcRef>) => {

    const {onCancelPressed} = props;
    const [_visible, _setVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [hintText, setHintText] = useState('');
    const animValue = useRef(new Animated.Value(0)).current;

    // Usamos useImperativeHandle para exponer métodos a través de la referencia
    useImperativeHandle(ref, () => ({
        setVisible: _setVisible,  // Exponemos el setter de visibilidad
        setHintText  // Exponemos el setter del texto
    }));
    
    useEffect(() => {
        if(_visible){
            setVisible(true);
            Animated.timing(animValue, {
                duration: 300,
                toValue: 1,
                useNativeDriver: true
            }).start();
        }else {
            Animated.timing(animValue, {
                duration: 300,
                toValue: 0,
                useNativeDriver: true,
            }).start(()=>{
                setVisible(false);
                setHintText('');
            });
        }
    },[_visible, animValue]);

   // function handleCancel() {
   //     setVisible(false);
   //     setHintText('');
   // }
   const backdropAnimStyle = {
    opacity: animValue
   };

   const promptAnimStyle = {
    transform: [{
        translateY: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [500, 0],
        }),
    }],
   };

    return (
        <Modal visible={visible} transparent={true}>
            <View style={styles.content}>
                <Animated.View style={[styles.backdrop, StyleSheet.absoluteFill, backdropAnimStyle]} />
                <Animated.View style={[styles.prompt, promptAnimStyle]}>
                    <Text style={styles.hint}>{hintText || "¡Hora de entrenar! 🏋️‍♂️💪"}</Text>
                    <Button style={styles.btn}
                        onPress={()=>{
                            _setVisible(false);
                            onCancelPressed();
                        }}>
                        <Text style={{color: '#000', fontSize: 16}}>CANCELAR</Text>
                    </Button>
                </Animated.View>
            </View>
        </Modal>
    );
}

export default forwardRef(AndroidPromptNfc);

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    backdrop: {
        backgroundColor: 'rgba(0,0,0,0.55)',
    },
    prompt: {
        position: 'absolute',
        bottom: 0,
        left: 20,
        marginBottom: 20,
        width: Dimensions.get('window').width - 2 * 20,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 60,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    hint: {
        fontSize: 24,
        marginBottom: 20,
    },
    btn: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
    }
});