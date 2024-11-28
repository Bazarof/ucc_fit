import { useRef, useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import firestore, {
  collection,
  firebase,
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";
import CardView from "@/components/CardView";

const routinesCollection = firestore().collection("routines");
// const routinesCollection = collection(firestore(), "routines");
// console.log(routinesCollection);

const Routines = () => {
  const navigation = useNavigation();
  const [routines, setRoutines] = useState<
    { id: string; name?: string; description: string; exercises: object[] }[]
  >([]);
  const [loading, setLoading] = useState(false);
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
    setRoutines(
      routinesList as {
        id: string;
        name: string;
        description: string;
        exercises: object[];
      }[]
    );
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    setLoading(false);
    console.log(JSON.stringify(routines));
  };

  const fetchMoreRoutines = async () => {
    if (loadingMore || !lastDoc) return;
    setLoadingMore(true);
    console.log("Loading more routines.");
    const snapshot = await routinesCollection
      .startAfter(lastDoc)
      .limit(10)
      .get();
    const moreRoutines = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      description: doc.data().description,
      exercises: doc.data().exercises,
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
      {/* <Text style={styles.text}>Rutinas</Text> */}
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          style={{ width: "100%", paddingTop: 10}}
          data={routines}
          keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CardView>
                <Link style={[styles.linkContainer, {flexDirection: 'row'}]} href={{
                  pathname: `/studentDrawer/(tabs)/rutinas/[id]`,
                  params: { id: item.id }
                }}>
                  <View>
                    <Image style={{width: 60, height: 60}} source={require('../../../../assets/images/icons/calentamiento.png')}/>
                  </View>
                  <View style={[{flex: 1}]}>
                    <View style= {[{flex: 1}]}>
                      <Text style={{backgroundColor: 'green'}}>{item.name}</Text>
                    </View>
                    <View style= {[{flex: 1, flexDirection: 'row'}]}>
                      <Text>01:30 hr</Text>
                    </View>
                  </View>
                </Link>
              </CardView>
            //<View style={styles.item}>
            //  <Link
            //    href={{
            //      pathname: `/studentDrawer/(tabs)/rutinas/[id]`,
            //      params: { id: item.id },
            //    }}
            //  >
            //    {item.name}
            //  </Link>
            //</View>
          )}
          onEndReached={fetchMoreRoutines}
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
  linkContainer: {
    flex: 1,
    width: '100%',
    //backgroundColor: 'green'
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
