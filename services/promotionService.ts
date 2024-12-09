import Promotion from "@/types/Promotion";
import { getFirestore } from "@react-native-firebase/firestore";

export const getAllPromotions = async (): Promise<Promotion[]> => {
    const promotionsCollection = getFirestore().collection("promotions");
    const promotions = await promotionsCollection.get();
    return promotions.docs.map((doc) => ({uid: doc.id, ...doc.data()}) as Promotion);
}