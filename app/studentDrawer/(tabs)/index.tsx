import { Text, View, StyleSheet } from 'react-native';
import React, { useRef } from 'react';
import { FAB } from 'react-native-paper';
import AndroidPromptNfc, { AndroidPromptNfcRef } from '@/components/NFC/AndroidPromptNfc';

// Dark mode color #25292e

export default function home() {

  const modalRef = useRef<AndroidPromptNfcRef>(null);

  const showModal = () => {
    if (modalRef.current) {
      modalRef.current.setVisible(true);  // Abre el modal
      modalRef.current.setHintText("New NFC prompt!");  // Cambia el texto del hint
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dashboard</Text>
      <FAB
        style={styles.fab}
        color='white'
        icon="account-check"
        onPress={() => showModal()}/>
      <AndroidPromptNfc ref={modalRef}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
  fab: {
    backgroundColor: '#007FAF',
    position: 'absolute',
    margin: 24,
    right: 0,
    bottom: 0,
  }
});