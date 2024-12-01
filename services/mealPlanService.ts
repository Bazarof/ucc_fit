import MealPlan from "@/types/MealPlan";
import { getFirestore } from "@react-native-firebase/firestore";

export const getMealPlan = async (userId: string): Promise<MealPlan> => {
    const db = getFirestore();
    const mealPlan = await db.collection("meal_plans").doc(userId.toString()).get();
    return mealPlan.data() as MealPlan;
}
