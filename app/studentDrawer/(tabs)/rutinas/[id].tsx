import firestore from "@react-native-firebase/firestore";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const routinesCollection = firestore().collection("routines");

const fetchRoutine = async (id: string) => {
  const routine = await routinesCollection.doc(id).get();

  // fetch routine.exercises and map them back to the routine object
  const routineData = routine.data();
  if (!routineData) {
    return null;
  }

  const exercisesData = await Promise.all(
    routineData.exercises.map(async (exerciseRef: any) => {
      const exerciseDoc = await exerciseRef.get();
      return exerciseDoc.exists
        ? { id: exerciseDoc.id, ...exerciseDoc.data() }
        : null;
    })
  );

  routineData.exercises = exercisesData;

  return routineData;
};

const Routine = () => {
  const params = useLocalSearchParams();
  const routineId = params.id as string;
  const [routine, setRoutine] = useState<any>(null);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutine(routineId)
      .then((routine) => {
        console.log(routine);
        setRoutine(routine);
      })
      .catch((error) => {
        console.error(error);
        // go back with alert
        navigation.goBack();
        Alert.alert("Error", "No se pudo cargar la rutina.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [routineId]);

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Text style={{ fontSize: 18 }}>{routine.name}</Text>
          <Text>{routine.description}</Text>
          <Text>Ejercicios:</Text>
          {routine.exercises.map((exercise: any) => (
            <Text key={exercise.id}>- {exercise.name}</Text>
          ))}
        </>
      )}
    </ScrollView>
  );
};

export default Routine;
