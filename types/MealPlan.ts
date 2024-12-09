import Meal from "./Meal";

export default interface MealPlan {
    uid: string;
    name: string;
    description: string;
    meals: Meal[];
    objective: string;
    created_at: Date;
    updated_at: Date;
}