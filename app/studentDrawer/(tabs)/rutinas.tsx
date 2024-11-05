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
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";

const routinesCollection = firestore().collection("routines");
console.log(routinesCollection);

export default function Rutina() {
  const [routines, setRoutines] = useState<{ id: string; name?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] =
    useState<FirebaseFirestoreTypes.QueryDocumentSnapshot | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchRoutines = async () => {
    setLoading(true);
    const snapshot = await routinesCollection.limit(10).get();
    const routinesList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRoutines(routinesList);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    setLoading(false);
  };

  const fetchMoreRoutines = async () => {
    if (loadingMore || !lastDoc) return;
    setLoadingMore(true);
    const snapshot = await routinesCollection
      .startAfter(lastDoc)
      .limit(10)
      .get();
    const moreRoutines = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRoutines((prevRoutines) => [...prevRoutines, ...moreRoutines]);
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
      <Text style={styles.text}>Rutinas</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={routines}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.name}</Text>
            </View>
          )}
          onEndReached={fetchMoreRoutines}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
}

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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 20,
  },
});
