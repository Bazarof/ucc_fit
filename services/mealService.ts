import Meal from "@/types/Meal";
import { getFirestore } from "@react-native-firebase/firestore";

export const createMeal = async (meal: Meal) => {
    const db = getFirestore();
    await db.collection("meals").add(meal);
}
