import { Text, View, StyleSheet, Platform } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { FAB } from 'react-native-paper';
import AndroidPromptNfc, { AndroidPromptNfcRef } from '@/components/NFC/AndroidPromptNfc';
import NfcManager, {NfcEvents} from 'react-native-nfc-manager';
import { useSession } from '@/components/session/SessionProvider';

// Dark mode color #25292e

export default function home() {

  const {isNfcEnabled} = useSession();

  const modalRef = useRef<AndroidPromptNfcRef>(null);

  async function scanTag(){

    await NfcManager.registerTagEvent();
    if(Platform.OS === 'android'){
      modalRef.current?.setVisible(true);
    }
  }
  
  useEffect(() => {

    const checkNfcEnabled = async () => {
      isNfcEnabled(await NfcManager.isEnabled());
    };

    checkNfcEnabled();

    let timeOut: NodeJS.Timeout;

    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: any) => {
      if(Platform.OS === 'android'){
        
        modalRef.current?.setHintText('Asistencia tomada...');
        modalRef.current?.setCheckAttendance(true);

        timeOut = setTimeout(() => {
          modalRef.current?.setVisible(false);
        }, 2000);

      }else{
        NfcManager.setAlertMessageIOS('Asistencia tomada...');
      }
      NfcManager.unregisterTagEvent().catch(()=>0);
      console.warn('Tag found: ', tag);
    });
    
    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      clearTimeout(timeOut);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dashboard</Text>
      <FAB
        style={styles.fab}
        color='white'
        icon="account-check"
        onPress={scanTag}
        />
      <AndroidPromptNfc ref={modalRef}
        onCancelPressed={()=>{
          NfcManager.unregisterTagEvent().catch(() => 0);
        }}/>
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