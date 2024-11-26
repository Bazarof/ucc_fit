import { useRef, useEffect, useState, ReactElement } from "react";
import { StyleSheet, View, FlatList, ActivityIndicator } from "react-native";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Href, Link, useRouter } from "expo-router";
import { FAB } from "react-native-paper";
import Routine from "@/types/Routine";
import Resource from "@/types/Resource";

type ResourceListProps<T> = {
  collectionName: string;
  whereClause?: [string, FirebaseFirestoreTypes.WhereFilterOp, any]; // Optional where filter
  itemRenderer: (item: T) => ReactElement; // Custom render function for items
  createRoute?: Href<string>; // Route for the FAB button
};

const ResourceList = <T extends Resource>({
  collectionName,
  whereClause,
  itemRenderer,
  createRoute,
}: ResourceListProps<T>) => {
  const router = useRouter();
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] =
    useState<FirebaseFirestoreTypes.QueryDocumentSnapshot | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchItems = async () => {
    setLoading(true);

    let query = firestore().collection(collectionName).limit(10);

    if (whereClause) {
      query = query.where(...whereClause);
    }

    const snapshot = await query.get();
    const itemList = snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    })) as T[];

    setItems(itemList);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    setLoading(false);
  };

  const fetchMoreItems = async () => {
    if (loadingMore || !lastDoc) return;

    setLoadingMore(true);

    let query = firestore()
      .collection(collectionName)
      .startAfter(lastDoc)
      .limit(10);

    if (whereClause) {
      query = query.where(...whereClause);
    }

    const snapshot = await query.get();
    const moreItems = snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    })) as T[];

    setItems((prevItems) => [...prevItems, ...moreItems]);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchItems();
  }, [collectionName, whereClause]);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <ActivityIndicator style={{ margin: 10 }} />;
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <FlatList
            style={{ width: "100%", padding: 20, backgroundColor: "#DADADA" }}
            data={items}
            keyExtractor={(item) => item.uid}
            renderItem={({ item }) => itemRenderer(item)}
            onEndReached={fetchMoreItems}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
          />
          {createRoute && (
            <FAB
              style={styles.fab}
              color="white"
              icon="plus"
              onPress={() => {
                router.push(createRoute);
              }}
            />
          )}
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
  fab: {
    backgroundColor: "#007FAF",
    position: "absolute",
    margin: 24,
    right: 0,
    bottom: 0,
  },
});

export default ResourceList;
