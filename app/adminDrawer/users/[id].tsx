import { getUser } from "@/services/userService";
import { User } from "@/types/User";
import firestore from "@react-native-firebase/firestore";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const usersCollection = firestore().collection("user");

// const getUser = async (id: string) => {
//   const user = await usersCollection.doc(id).get();

//   // fetch user.exercises and map them back to the user object
//   const userData = user.data();
//   if (!userData) {
//     return null;
//   }

//   // const exercisesData = await Promise.all(
//   //   userData.exercises.map(async (exerciseRef: any) => {
//   //     const exerciseDoc = await exerciseRef.get();
//   //     return exerciseDoc.exists
//   //       ? { id: exerciseDoc.id, ...exerciseDoc.data() }
//   //       : null;
//   //   })
//   // );

//   // userData.exercises = exercisesData;

//   return userData;
// };

const UserDetail = () => {
  const params = useLocalSearchParams();
  const userId = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser(userId)
      .then((user) => {
        console.log(user);
        setUser(user);
      })
      .catch((error) => {
        console.error(error);
        // go back with alert
        navigation.goBack();
        Alert.alert("Error", "No se pudo cargar el usuario.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  return (
    // <Text>{user?.displayName}</Text>

    // iterate over all fields and show them

    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          {Object.entries(user as User).map(([key, value]) => (
            <Text key={key}>
              {key}: {value}
            </Text>
          ))}
        </>
      )}
    </ScrollView>

    // <ScrollView contentContainerStyle={{ padding: 20 }}>
    //   {loading ? (
    //     <ActivityIndicator size="large" />
    //   ) : (
    //     <>
    //       <Text style={{ fontSize: 18 }}>{user.name}</Text>
    //       <Text>{user.description}</Text>
    //       <Text>Ejercicios:</Text>
    //       {user.exercises.map((exercise: any) => (
    //         <Text key={exercise.id}>- {exercise.name}</Text>
    //       ))}
    //     </>
    //   )}
    // </ScrollView>
  );
};

export default UserDetail;
