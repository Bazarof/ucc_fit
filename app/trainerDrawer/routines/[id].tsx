import { getRoutine } from "@/services/routineService";
import Exercise from "@/types/Exercise";
import Routine from "@/types/Routine";
import { User } from "@/types/User";
import firestore from "@react-native-firebase/firestore";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function RoutineDetail() {
  const params = useLocalSearchParams();
  const routineId = params.id as string;
  const [routine, setRoutine] = useState<Routine | null>(null);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRoutine(routineId)
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
    // <Text>{routine?.displayName}</Text>

    // iterate over all fields and show them

    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          {/* {Object.entries(routine as Routine).map(([key, value]) => (
            <Text key={key}>
              {key}: {typeof value === 'object' ? JSON.stringify(value) : value}
            </Text>
          ))} */}
          <Text style={{ fontSize: 18 }}>{routine?.name}</Text>
        </>
      )}
    </ScrollView>

    // <ScrollView contentContainerStyle={{ padding: 20 }}>
    //   {loading ? (
    //     <ActivityIndicator size="large" />
    //   ) : (
    //     <>
    //       <Text style={{ fontSize: 18 }}>{exercise.name}</Text>
    //       <Text>{exercise.description}</Text>
    //       <Text>Ejercicios:</Text>
    //       {user.exercises.map((exercise: any) => (
    //         <Text key={exercise.id}>- {exercise.name}</Text>
    //       ))}
    //     </>
    //   )}
    // </ScrollView>
  );
}
