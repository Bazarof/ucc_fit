export default interface Meal {
    uid: string;
    name: string;
    description: string;
    image_url: string;
    // ingredients: Ingredient[];
    created_at: Date;
    updated_at: Date;
}