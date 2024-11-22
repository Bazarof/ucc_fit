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
import { Link } from "expo-router";
import { User } from "@/types/User";

const studentsCollection = firestore().collection("users");

const Students = () => {
  const navigation = useNavigation();
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] =
    useState<FirebaseFirestoreTypes.QueryDocumentSnapshot | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const auth = firebase.auth();
  // const admin = firebase.auth().listUsers();

  const fetchStudents = async () => {
    setLoading(true);

    const snapshot = await studentsCollection
      .limit(10)
      .where("role", "==", "student")
      .get();
    const studentsList = snapshot.docs.map(
      (doc) =>
        ({
          uid: doc.id,
          ...doc.data(),
        } as unknown as User)
    );

    setStudents(studentsList as User[]);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    setLoading(false);
    console.log(JSON.stringify(students));
  };

  const fetchMoreStudents = async () => {
    if (loadingMore || !lastDoc) return;
    setLoadingMore(true);
    console.log("Loading more students.");
    const snapshot = await studentsCollection
      .startAfter(lastDoc)
      .limit(10)
      .where("role", "==", "student")
      .get();
    const moreStudents: any = snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
      // name: doc.data().name,
      // campus: doc.data().campus,
      // description: doc.data().description,
      // exercises: doc.data().exercises,
    }));
    setStudents((prevStudents) => [...prevStudents, ...moreStudents]);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchStudents();
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
        <FlatList
          style={{ width: "100%", padding: 20 }}
          data={students}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Link
                href={{
                  pathname: `/trainerDrawer/students/[id]`,
                  params: { id: item.uid },
                }}
              >
                {item.displayName}
              </Link>
            </View>
          )}
          onEndReached={fetchMoreStudents}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
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
});

export default Students;
