import { Text, View, StyleSheet, Platform } from "react-native";
import React, { useEffect, useRef } from "react";
import { FAB } from "react-native-paper";
import AndroidPromptNfc, {
  AndroidPromptNfcRef,
} from "@/components/NFC/AndroidPromptNfc";
import NfcManager, { NfcEvents } from "react-native-nfc-manager";
import { getFirestore } from "@react-native-firebase/firestore";
import { useSession } from "@/components/session/SessionProvider";

// Dark mode color #25292e

const attendanceCollection = getFirestore().collection("attendance");

const createAttendance = async (
  studentId: string,
  type: "in" | "out" = "in"
) => {
  const attendance = await attendanceCollection.add({
    user: `users/${studentId}`,
    created_at: new Date(),
    type,
  });

  return attendance.id;
};

const fetchLatestAttendance = async (studentId: string) => {
  // get the latest attendance that happened within the current day

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  const attendance = await attendanceCollection
    .where("user", "==", `users/${studentId}`)
    .where("created_at", ">=", startOfDay)
    .where("created_at", "<", endOfDay)
    .orderBy("created_at", "desc")
    .limit(1)
    .get();

  return attendance.docs[0]?.data();
};

export default function home() {
  const modalRef = useRef<AndroidPromptNfcRef>(null);

  const { session } = useSession();

  async function scanTag() {
    await NfcManager.registerTagEvent();
    if (Platform.OS === "android") {
      modalRef.current?.setVisible(true);
    }
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: any) => {
      if (Platform.OS === "android") {
        modalRef.current?.setHintText("Asistencia tomada...");

        fetchLatestAttendance(session.uid)
          .then((attendance) => {
            console.log("Attendance", attendance);

            createAttendance(
              session.uid,
              attendance?.type === "in" ? "out" : "in"
            );
          })
          .catch(console.error);

        timeout = setTimeout(() => {
          modalRef.current?.setVisible(false);
        }, 5000);
      } else {
        NfcManager.setAlertMessageIOS("Asistencia tomada...");
      }
      NfcManager.unregisterTagEvent().catch(() => 0);
      console.log("Tag found: ", tag);
    });

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);

      clearTimeout(timeout);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dashboard</Text>
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
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
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
});
