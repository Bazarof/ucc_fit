import Meal from "./Meal";

export default interface MealPlan {
    uid: string;
    name: string;
    description: string;
    meals: Meal[];
    createdAt: Date;
    updatedAt: Date;
}