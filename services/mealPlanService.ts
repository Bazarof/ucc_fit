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

export const getUsersWithoutMealPlan = async (): Promise<number> => {
    const db = getFirestore();
    const users = await db.collection("users").where('role', '==', 'student').get();
    // debugger
    const mealPlans = await db.collection("meal_plans").get();

    return users.docs.length - mealPlans.docs.length;
}

export const getUsersWithMealPlan = async (): Promise<number> => {
    const db = getFirestore();
    const mealPlans = await db.collection("meal_plans").get();

    return mealPlans.docs.length;
}

export const getDateofLastPlan = async (): Promise<Date> => {
    const db = getFirestore();
    const mealPlans = await db.collection("meal_plans").get();

    const dates = mealPlans.docs.map((doc) => doc.data()?.created_at?.toDate());
    return dates.reduce((a, b) => (a > b ? a : b));
}