import Meal from "./Meal";

export default interface MealPlan {
    id: number;
    name: string;
    description: string;
    meals: Meal[];
    createdAt: Date;
    updatedAt: Date;
}