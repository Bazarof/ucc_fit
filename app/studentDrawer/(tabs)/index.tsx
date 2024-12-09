import { Text, View, Image, StyleSheet, Platform, AppState } from "react-native";
import React, { ProfilerOnRenderCallback, useEffect, useRef, useState } from "react";
import { FAB, ProgressBar } from "react-native-paper";
import AndroidPromptNfc, {
  AndroidPromptNfcRef,
} from "@/components/NFC/AndroidPromptNfc";
import NfcManager, { NfcEvents } from "react-native-nfc-manager";
import { useSession } from "@/components/session/SessionProvider";
import CardView from "@/components/CardView";
import { ScrollView } from "react-native-gesture-handler";
import { createAttendance, fetchLatestAttendance, getCompletedSessionsByUser, getUserConsecutiveWeeks } from "@/services/attendanceService";
import { getUserCurrentRoutine } from "@/services/routineService";
import Routine from "@/types/Routine";
import { getAllPromotions } from "@/services/promotionService";
import Promotion from "@/types/Promotion";
import ImageCardView from "@/components/ImageCardView";

// Dark mode color #25292e

export default function home() {

  // Ref to modal
  const modalRef = useRef<AndroidPromptNfcRef>(null);

  // session values
  const { session, nfcEnabled, isNfcEnabled } = useSession();

  // home variables
  const [progreso, setProgreso] = useState(0);
  const [sesiones, setSesiones] = useState(0);
  const [totalSesiones, setTotalSesiones] = useState(0);
  const [consecutiveWeeks, setConsecutiveWeeks] = useState(0);
  const [promotions, setPromotions] = useState<Promotion[] | undefined>();

  const [currentRoutine, setCurrentRoutine] = useState<Routine | null>(null);
  const [sessionsThisMonth, setSessionsThisMonth] = useState(0);

  async function scanTag() {
    if (nfcEnabled) {
      await NfcManager.registerTagEvent();
      if (Platform.OS === "android") {
        modalRef.current?.setVisible(true);
      }
    } else {
      // only android devices might not have nfc enabled
      modalRef.current?.setVisible(true);
    }
  }

  // Verificar si NFC está habilitado
  const checkNfcStatus = async () => {
    const enabled = await NfcManager.isEnabled();
    isNfcEnabled(enabled);
  };

  // Detecta cuando la app regresa al primer plano
  const handleAppStateChange = (nextAppState: any) => {
    if (nextAppState === 'active') {
      checkNfcStatus();  // Verifica el estado de NFC cuando la app vuelve al primer plano
    }
  };

  useEffect(() => {
    try {
      Promise.all([
        getCompletedSessionsByUser(session!.uid),
        getUserCurrentRoutine(session!.uid),
      ]).then(([completedSessions, routine]) => {
        setSesiones(completedSessions);
        setTotalSesiones(routine?.sessions || 0);
        setSessionsThisMonth(completedSessions);
        setProgreso(completedSessions / (routine?.sessions || 1));
        setCurrentRoutine(routine);
      });

      getUserConsecutiveWeeks(session!.uid).then((weeks) => {
        setConsecutiveWeeks(weeks);
      });

      getAllPromotions()
      .then((promotions)=>{
        setPromotions(promotions);
        
      })
      .catch((error)=>{console.log("PROMOTIONS ERROR: ", error);});

    } catch (error) {
      console.error("Error fetching user's current routine:", error);
    }

    checkNfcStatus();

    let timeOut: NodeJS.Timeout;

    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: any) => {
      if (Platform.OS === 'android') {

        modalRef.current?.setHintText('Asistencia tomada...');
        modalRef.current?.setCheckAttendance(true);

        fetchLatestAttendance(session!.uid)
          .then((attendance) => {
            console.log("Attendance", attendance);

            createAttendance(
              session!.uid,
              attendance?.type === "in" ? "out" : "in"
            );
          })
          .catch(console.error);

        timeOut = setTimeout(() => {
          modalRef.current?.setVisible(false);
        }, 2000);
      } else {
        NfcManager.setAlertMessageIOS("Asistencia tomada...");
      }
      NfcManager.unregisterTagEvent().catch(() => 0);
      console.log("Tag found: ", tag);
    });

    const appStateListener = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      appStateListener.remove();
      clearTimeout(timeOut);
    };
  }, []);

  return (
    <View style={[styles.container]}>
      <ScrollView style={[styles.scrollview]}>
        {/* Mi entrenamiento */}
        <CardView>
          <View style={[styles.container]}>
            <Text style={styles.title}>Mi entrenamiento</Text>
          </View>

          <View style={[styles.container, { flexDirection: "row" }]}>
            <View style={[styles.container]}>
              <Text style={[styles.progressTitle]}>
                {Math.floor(progreso * 100) + "%"}
              </Text>
            </View>
            <View style={[styles.container, { justifyContent: "flex-end" }]}>
              <Text style={styles.textSesiones}>
                {sesiones + "/" + totalSesiones + " sesiones"}
              </Text>
            </View>
          </View>

          <View style={[styles.container, { width: "100%" }]}>
            <ProgressBar
              progress={progreso}
              style={styles.progressBar}
              color="#007FAF"
            />
          </View>
        </CardView>

        {/* Tu rutina */}
        <CardView>
          <View style={[styles.container]}>
            <Text style={styles.title}>Seguimiento</Text>
          </View>

          <View
            style={[
              styles.container,
              { flexDirection: "row", marginBottom: 15 },
            ]}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Image
                style={{ width: 42, height: 42, marginTop: 15, marginEnd: 10 }}
                source={require("../../../assets/images/icons/dumbell.png")}
              />
              <View style={[styles.container]}>
                <Text style={styles.text}>{consecutiveWeeks}</Text>
                <Text style={{ lineHeight: 25 }}>
                  {"Semanas de "}
                  {"entrenamiento "}
                  {"consecutivas"}
                </Text>
              </View>
            </View>

            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ height: "100%", padding: 7 }}>
                <Image
                  style={{ height: 30, width: 30 }}
                  source={require("../../../assets/images/icons/yellow-status.png")}
                />
              </View>

              <View style={[styles.container]}>
                <Text style={[styles.text]}>Medio</Text>
                <Text style={{ lineHeight: 25 }}>
                  {"Compromiso con el "}
                  {"entrenamiento"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.conatinerStatus}>
            <Text style={styles.textStatus}>
              ¡Estás en el camino correcto :)!
            </Text>
          </View>
        </CardView>

        <CardView>
          <View style={[styles.container, { marginBottom: 20 }]}>
            <Text style={[styles.title]}>En el último mes</Text>
          </View>

          <View
            style={[
              styles.container,
              {
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#F2F2F2",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <Text style={{ fontSize: 32 }}>{sessionsThisMonth}</Text>
            </View>
            <View>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  color: "#525252",
                  textAlign: "center",
                }}
              >
                {"Entrenamientos\n"}
                {"completados"}
              </Text>
            </View>
          </View>
        </CardView>

        {/* Advertisement */}

        {promotions &&
          promotions.map((promo: Promotion) => (
            <ImageCardView key={promo.uid}>
              <Image
                style={{
                  height: 200,
                  width: "100%",
                  borderRadius: 20,
                  position: "absolute",
                  top: 0,
                }}
                source={{ uri: promo.image_url }}
                resizeMode={"cover"}
              />
              <View style={[styles.overlay, StyleSheet.absoluteFill]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.overlayText, { fontSize: 36 }]}>
                    {promo.title}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.overlayText, { fontSize: 20 }]}>
                    {promo.subtitle}
                  </Text>
                </View>
              </View>
            </ImageCardView>
          ))}
      </ScrollView>
      <FAB
        style={styles.fab}
        color="white"
        icon="account-check"
        onPress={scanTag}
      />
      <AndroidPromptNfc
        ref={modalRef}
        onCancelPressed={() => {
          NfcManager.unregisterTagEvent().catch(() => 0);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  overlayText: {
    color: '#fff',    // Texto blanco
    fontWeight: 'bold',  // Poner el texto en negrita
    zIndex: 1,
  },
  container: {
    flex: 1,
  },
  conatinerStatus: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  scrollview: {
    flex: 1,
    paddingTop: 10,
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
  },
  textSesiones: {
    marginBottom: 10,
    alignSelf: 'flex-end',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#525252'
  },
  textStatus: {
    fontWeight: 'bold',
    color: '#007FAF'
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
  fab: {
    backgroundColor: "#007FAF",
    position: "absolute",
    margin: 24,
    right: 0,
    bottom: 0,
  },
  title: {
    fontSize: 25,
  },
  progressTitle: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  progressBar: {
    width: '100%',
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F2F2F2'
  },

});
