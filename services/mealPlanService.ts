import MealPlan from "@/types/MealPlan";
import { getFirestore } from "@react-native-firebase/firestore";

export const getMealPlan = async (userId: string): Promise<MealPlan | null> => {
    const db = getFirestore();
    const mealPlan = await db.collection("meal_plans").doc(userId).get();

    if (!mealPlan.exists) return null;

    return { ...mealPlan.data(), uid: mealPlan.id } as MealPlan;
}

export const createMealPlan = async (mealPlan: MealPlan) => {
    const db = getFirestore();
    await db.collection("meal_plans").doc(mealPlan.uid).set(mealPlan);
}