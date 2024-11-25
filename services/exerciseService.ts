import Exercise from "@/types/Exercise";
import { getFirestore } from "@react-native-firebase/firestore";

export const getAllExercises = async (): Promise<Exercise[]> => {
  const exerciseCollection = getFirestore().collection("exercises");
  const exercises = await exerciseCollection.get();
  return exercises.docs.map((doc) => ({ uid: doc.id, ...doc.data() }) as Exercise);
};

export const getExercise = async (id: string): Promise<Exercise> => {
  const exerciseDoc = await getFirestore()
    .collection("exercises")
    .doc(id)
    .get();
  return exerciseDoc.data() as Exercise;
};

export const createExercise = async (exercise: Exercise): Promise<void> => {
  await getFirestore().collection("exercises").add(exercise);
  //   return exercise;
};
