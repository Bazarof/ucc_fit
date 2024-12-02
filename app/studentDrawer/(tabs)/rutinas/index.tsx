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
import { Link, router } from "expo-router";
import CardView from "@/components/CardView";
import IntensityIcon from "@/components/IntensityIcon";

const routinesCollection = firestore().collection("routines");
// const routinesCollection = collection(firestore(), "routines");
// console.log(routinesCollection);

const Routines = () => {
  const navigation = useNavigation();
  const [routines, setRoutines] = useState<
    { id: string; name?: string; description: string; exercises: object[]; intensity: number; image_url: string; }[]
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
        intensity: number;
        image_url: string;
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
      intensity: doc.data().intensity,
      image_url: doc.data().image_url,
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
          <>
            <FlatList
              style={{ flex: 1, paddingTop: 10 }}
              data={routines}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <CardView>
                  <TouchableOpacity style={[styles.linkContainer, {}]} onPress={() => {
                    router.navigate({
                      pathname: `/studentDrawer/(tabs)/rutinas/[id]`,
                      params: { id: item.id }
                    });
                  }}>

                    <View style={{ width: '100%', flexDirection: 'row' }}>
                      <View>
                        <Image style={{ height: 60, width: 60 }} source={{uri: item.image_url}} />
                      </View>
                      <View style={{ flex: 1, height: '100%' }}>
                        <View style={{ width: '100%', marginBottom: 5 }}><Text style={styles.cardTitle}>{item.name}</Text></View>
                        <View style={{ width: '100%', flexDirection: 'row' }}>
                          <View style={{ flex: 1 }}><IntensityIcon intensity={item.intensity} /></View>
                          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Image style={{ height: 20, width: 20, alignSelf: 'center', marginEnd: 5 }} source={require('../../../../assets/images/icons/clock.png')} />
                            <Text style={styles.cardText}>01:30 hr</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                  </TouchableOpacity>
                </CardView>
              )}
              onEndReached={fetchMoreRoutines}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
            />
          </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linkContainer: {
    flexDirection: 'row',
    width: '100%'
    //backgroundColor: 'green'
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 26,
    alignSelf: 'flex-end'
  },
  cardText: {
    fontSize: 18,
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

export default Routines;