import Exercise from "./Exercise";
import Resource from "./Resource";

export default interface Routine extends Resource {
  name: string;
  description: string;
  user: string;
  nutritionist: string;
  exercises: Exercise[];
}
