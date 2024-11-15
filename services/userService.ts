import { User } from "@/types/User";
import { getFirestore } from "@react-native-firebase/firestore";

export const getUser = async (uid: string) => {
  const userDoc = await getFirestore().collection("users").doc(uid).get();
  return userDoc.data() as User;
};

export const createUser = async (user: User) => {
  console.log("Creating user", user);
  const userDoc = getFirestore().collection("users").doc(user.uid);
  console.log("userdoc: ", userDoc);
  await userDoc.set(user);
  return user;
};

export const getAllUsers = async () => {
  const usersCollection = getFirestore().collection("users");
  const users = await usersCollection.get();
  return users.docs.map((doc) => doc.data() as User);
};
