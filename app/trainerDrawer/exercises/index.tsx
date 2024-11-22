import { useRef, useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import firestore, {
  collection,
  firebase,
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Link, useRouter } from "expo-router";
import { User } from "@/types/User";
import Exercise from "@/types/Exercise";
import { FAB } from "react-native-paper";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

const exercisesCollection = firestore().collection("exercises");

const Students = () => {
  // const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const router = useRouter();
  const navigation = useNavigation();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] =
    useState<FirebaseFirestoreTypes.QueryDocumentSnapshot | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const auth = firebase.auth();
  // const admin = firebase.auth().listUsers();

  const fetchExercises = async () => {
    setLoading(true);

    const snapshot = await exercisesCollection.limit(10).get();
    const exercisesList = snapshot.docs.map(
      (doc) =>
        ({
          uid: doc.id,
          ...doc.data(),
        } as unknown as Exercise)
    );

    setExercises(exercisesList as Exercise[]);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    setLoading(false);
    console.log(JSON.stringify(exercises));
  };

  const fetchMoreExercises = async () => {
    if (loadingMore || !lastDoc) return;
    setLoadingMore(true);
    console.log("Loading more exercises.");
    const snapshot = await exercisesCollection
      .startAfter(lastDoc)
      .limit(10)
      .where("role", "==", "student")
      .get();
    const moreExercises: any = snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
      // name: doc.data().name,
      // campus: doc.data().campus,
      // description: doc.data().description,
      // exercises: doc.data().exercises,
    }));
    setExercises((prevExercises) => [...prevExercises, ...moreExercises]);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <ActivityIndicator style={{ margin: 10 }} />;
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>Rutinas</Text> */}
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <FlatList
            style={{ width: "100%", padding: 20 }}
            data={exercises}
            keyExtractor={(item) => item.uid}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Link
                  href={{
                    pathname: `/trainerDrawer/exercises/[id]`,
                    params: { id: item.uid },
                  }}
                >
                  {item.name}
                </Link>
              </View>
            )}
            onEndReached={fetchMoreExercises}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
          />
          <FAB
            style={styles.fab}
            color="white"
            icon="plus"
            onPress={() => {
              router.push("/trainerDrawer/exercises/create_exercise");
            }}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
  },
  item: {
    flex: 1,
    width: "100%",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 20,
  },
  fab: {
    backgroundColor: "#007FAF",
    position: "absolute",
    margin: 24,
    right: 0,
    bottom: 0,
  },
});

export default Students;
