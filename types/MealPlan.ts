import Meal from "./Meal";

export default interface MealPlan {
    uid: string;
    name: string;
    description: string;
    meals: Meal[];
    objective: string;
    createdAt: Date;
    updatedAt: Date;
}