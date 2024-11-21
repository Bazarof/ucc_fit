import { forwardRef, useState, useEffect, useRef, useImperativeHandle } from "react";
import { View, Image, Text, Modal, StyleSheet, Dimensions, Animated } from "react-native";
import { Button } from "react-native-paper";
import NfcManager, {NfcEvents} from 'react-native-nfc-manager';
import { useSession } from "../session/SessionProvider";

// Define el tipo para el objeto que será referenciado
export interface AndroidPromptNfcRef {
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setHintText: React.Dispatch<React.SetStateAction<string>>;
    setCheckAttendance: React.Dispatch<React.SetStateAction<boolean>>;
}

const AndroidPromptNfc = (props: any, ref: React.Ref<AndroidPromptNfcRef>) => {

    const {nfcEnabled} = useSession();

    const { onCancelPressed } = props;
    const [_visible, _setVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [hintText, setHintText] = useState('');
    const [checkAttendance, setCheckAttendance] = useState(false);
    const animValue = useRef(new Animated.Value(0)).current;

    // Usamos useImperativeHandle para exponer métodos a través de la referencia
    useImperativeHandle(ref, () => ({
        setVisible: _setVisible,  // Exponemos el setter de visibilidad
        setHintText,  // Exponemos el setter del texto
        setCheckAttendance,
    }));

    useEffect(() => {
        if (_visible) {
            setVisible(true);
            Animated.timing(animValue, {
                duration: 300,
                toValue: 1,
                useNativeDriver: true
            }).start();
        } else {
            Animated.timing(animValue, {
                duration: 300,
                toValue: 0,
                useNativeDriver: true,
            }).start(() => {
                setVisible(false);
                setHintText('');
                setCheckAttendance(false);
            });
        }
    }, [_visible, animValue]);

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

                    {!nfcEnabled ?
                        <View>
                            <Text style={styles.hint}>Activa NFC para tomar asistencia</Text>

                            <Button style={[styles.btn, {marginBottom: 20}]}
                                onPress={() => {
                                    NfcManager.goToNfcSetting();
                                    _setVisible(false);
                                }}>
                                <Text style={{ color: '#000', fontSize: 16 }}>ACTIVAR</Text>
                            </Button>
                            <Button style={styles.btn}
                                onPress={() => {
                                    _setVisible(false);
                                    onCancelPressed();
                                }}>
                                <Text style={{ color: '#000', fontSize: 16 }}>CANCELAR</Text>
                            </Button>
                        </View>
                        :
                        <View>
                            <Text style={styles.hint}>{hintText || "Tomar asistencia"}</Text>
                            {
                                // if user has checked attendance
                                checkAttendance ?
                                    <Image style={{
                                        height: 50,
                                        width: 50,
                                        marginBottom: 20
                                    }} source={require('../../assets/images/icons/check.png')} />
                                    :
                                    <View style={{ alignItems: 'center' }}>
                                        <Image style={styles.iconNfc}
                                            source={require('../../assets/images/icons/mobile-pay.png')} />
                                        <Text style={styles.textNfc}>(Acerca el celular al icono)</Text>
                                    </View>

                            }
                            <Button style={styles.btn}
                                onPress={() => {
                                    _setVisible(false);
                                    onCancelPressed();
                                }}>
                                <Text style={{ color: '#000', fontSize: 16 }}>CANCELAR</Text>
                            </Button>
                        </View>
                    }


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
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    btn: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
    },
    iconNfc: {
        height: 100,
        width:100,
        marginBottom: 20,
    },
    textNfc: {
        marginBottom: 20,
        fontSize: 22,
        color: '#5b5b5b'
    },
});