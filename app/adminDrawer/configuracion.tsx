import ButtonOption from "@/components/ButtonOption";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSession } from "@/components/session/SessionProvider";
import { useRouter } from "expo-router";

export default function AdminConfig() {
  const { signOut } = useSession();
  const router = useRouter();

  return (
    <ScrollView style={styles.container_scroll}>
      <View style={styles.scroll_item_style}>

        <ButtonOption
          button_style={styles.button_style}
          text_style={styles.text_style}
          title="Ver como estudiante"
          action={() => router.push("/studentDrawer/(tabs)")}
        />

        <ButtonOption
          button_style={styles.button_style}
          text_style={styles.text_style}
          title="Ver como entrenador"
          action={() => router.push("/trainerDrawer/")}
        />

        <ButtonOption
          button_style={styles.button_style}
          text_style={styles.text_style}
          title="Cerrar sesión"
          action={signOut}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container_scroll: {
    flex: 1,
  },
  button_style: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    marginVertical: 5
  },
  scroll_item_style: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  text_style: {
    alignSelf: "center",
    fontSize: 25,
    fontWeight: "bold",
  },
});
