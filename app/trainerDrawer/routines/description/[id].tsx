import CardView from "@/components/CardView";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { getExercise } from "@/services/exerciseService";
import Exercise from "@/types/Exercise";

// import '@/assets/images/icons/dumbell.png';

export default function Description() {
  const params = useLocalSearchParams();
  const exerciseId = params.id as string;

  const [exercise, setExercise] = useState<Exercise | null>();

  const [loading, setLoading] = useState(true);
  const [visibleInstructions, setVisibleInstructions] =
    useState<boolean>(false);

  useEffect(() => {
    // Fetch exercise data
    getExercise(exerciseId)
      .then((exercise) => {
        //console.log("[EJERCICIO]: ", exercise);
        setExercise(exercise);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [exerciseId]);

  return (
    <View style={[styles.container]}>
      {loading ? (
        <ActivityIndicator color={"#007FAF"} size="large" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View>
            <CardView>
              <View>
                <Text style={styles.title}>{exercise!.name}</Text>
              </View>
              <View style={{ alignSelf: "center" }}>
                <Image
                  style={{ height: 300, width: 300 }}
                  source={{ uri: exercise!.image_url }}
                />
              </View>
            </CardView>

            <View
              style={{
                marginBottom: 10,
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
              }}
            >
              <View style={styles.exerciseContainer}>
                <View>
                  <Text style={{ fontSize: 40, fontWeight: "bold" }}>Reps</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    paddingTop: 10,
                    alignItems: "center",
                  }}
                >
                  <View>
                    <Image
                      style={{ height: 56, width: 56 }}
                      source={require("@/assets/images/icons/dumbell.png")}
                    />
                  </View>
                  <View>
                    <Text style={{ fontSize: 60, fontWeight: "bold" }}>
                      {exercise!.reps}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.exerciseContainer}>
                <View>
                  <Text style={styles.title2}>Tiempo entre series</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    paddingTop: 10,
                    alignItems: "center",
                  }}
                >
                  <View>
                    <Image
                      style={{ height: 36, width: 36 }}
                      source={require("@/assets/images/icons/clock.png")}
                    />
                  </View>
                  <View>
                    <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                      05:00 min
                    </Text>
                    {/* Insertar tiempo entre series */}
                  </View>
                </View>
              </View>
            </View>

            {/* Instricciones */}
            <CardView>
              <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() => {
                  setVisibleInstructions(!visibleInstructions);
                }}
              >
                <View style={{ flexDirection: "row", width: "100%" }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title2}>Instrucciones</Text>
                  </View>
                  <View
                    style={{ flex: 1, width: "100%", alignItems: "flex-end" }}
                  >
                    <Image
                      style={{ height: 40, width: 40 }}
                      source={require("@/assets/images/icons/down-arrow.png")}
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <View
                style={[
                  !visibleInstructions && { display: "none" },
                  { marginTop: 10 },
                ]}
              >
                <Text style={styles.text}>{exercise!.description}</Text>
              </View>
            </CardView>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  exerciseContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "white",
    width: 175,
    height: 170,
    borderRadius: 10,
    elevation: 2,
  },
  scrollView: {
    paddingTop: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
  },
  title2: {
    fontSize: 26,
    fontWeight: "bold",
  },
  text: {
    fontSize: 18,
    textAlign: "justify",
  },
});
