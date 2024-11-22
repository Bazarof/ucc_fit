export default interface Exercise {
  uid: string;
  name: string;
  muscleGroup: "chest" | "back" | "shoulders" | "legs" | "arms";
  image_url: string;
  description: string;
}
