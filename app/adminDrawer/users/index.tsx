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

// import * from "@react-native-firebase/admin";

import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";
import { User } from "@/types/User";

const usersCollection = firestore().collection("users");
// const usersCollection = collection(firestore(), "users");
// console.log(usersCollection);

const Routines = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] =
    useState<FirebaseFirestoreTypes.QueryDocumentSnapshot | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const auth = firebase.auth();
  // const admin = firebase.auth().listUsers();

  const fetchRoutines = async () => {
    setLoading(true);

    const snapshot = await usersCollection.limit(10).get();
    const usersList = snapshot.docs.map(
      (doc) =>
        ({
          uid: doc.id,
          ...doc.data(),
        } as unknown as User)
    );

    setUsers(usersList as User[]);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    setLoading(false);
    console.log(JSON.stringify(users));
  };

  const fetchMoreUsers = async () => {
    if (loadingMore || !lastDoc) return;
    setLoadingMore(true);
    console.log("Loading more users.");
    const snapshot = await usersCollection.startAfter(lastDoc).limit(10).get();
    const moreUsers: any = snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
      // name: doc.data().name,
      // campus: doc.data().campus,
      // description: doc.data().description,
      // exercises: doc.data().exercises,
    }));
    setUsers((prevUsers) => [...prevUsers, ...moreUsers]);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchRoutines();
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
          data={users}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Link
                href={{
                  pathname: `/adminDrawer/users/[id]`,
                  params: { id: item.uid },
                }}
              >
                {item.displayName}
              </Link>
            </View>
          )}
          onEndReached={fetchMoreUsers}
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

export default Routines;
