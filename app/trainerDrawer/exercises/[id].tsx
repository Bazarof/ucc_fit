import { getExercise } from "@/services/exerciseService";
import { getUser } from "@/services/userService";
import Exercise from "@/types/Exercise";
import { User } from "@/types/User";
import firestore from "@react-native-firebase/firestore";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function StudentDetail() {
  const params = useLocalSearchParams();
  const exerciseId = params.id as string;
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExercise(exerciseId)
      .then((exercise) => {
        console.log(exercise);
        setExercise(exercise);
      })
      .catch((error) => {
        console.error(error);
        // go back with alert
        navigation.goBack();
        Alert.alert("Error", "No se pudo cargar el ejercicio.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [exerciseId]);

  return (
    // <Text>{exercise?.displayName}</Text>

    // iterate over all fields and show them

    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          {Object.entries(exercise as Exercise).map(([key, value]) => (
            <Text key={key}>
              {key}: {value}
            </Text>
          ))}
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
