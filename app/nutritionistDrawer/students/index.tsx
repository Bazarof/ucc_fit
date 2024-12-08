import { useEffect, useState, useRef, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  View,
  Text,
} from "react-native";
import firestore, {
  firebase,
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { Link } from "expo-router";
import { User } from "@/types/User";
import { getMealPlan } from "@/services/mealPlanService"; // This is the function to get meal plans for users
import { Icon } from "react-native-paper";

const usersCollection = firestore().collection("users");

const UsersWithMealPlans = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] =
    useState<FirebaseFirestoreTypes.QueryDocumentSnapshot | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [mealPlansMap, setMealPlansMap] = useState<Record<string, boolean>>({});

  // Fetch initial users
  const fetchUsers = async (query = "") => {
    setLoading(true);

    let querySnapshot = usersCollection.where("role", "==", "student"); // If role = student
    if (query) {
      querySnapshot = querySnapshot
        .where("displayName", ">=", query)
        .where("displayName", "<=", query + "\uf8ff");
    }

    const snapshot = await querySnapshot.limit(10).get();
    const usersList = snapshot.docs.map(
      (doc) =>
      ({
        uid: doc.id,
        ...doc.data(),
      } as unknown as User)
    );

    setUsers(usersList);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    setLoading(false);

    fetchMealPlansForUsers(usersList);
  };

  // Fetch more users for pagination
  const fetchMoreUsers = async () => {
    if (loadingMore || !lastDoc || searching) return;
    setLoadingMore(true);

    const snapshot = await usersCollection
      .startAfter(lastDoc)
      .limit(10)
      .where("role", "==", "student")
      .get();

    const moreUsers = snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    }) as User);

    setUsers((prev) => [...prev, ...moreUsers]);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    setLoadingMore(false);

    fetchMealPlansForUsers(moreUsers);
  };

  // Fetch meal plan status for each user
  const fetchMealPlansForUsers = async (usersList: User[]) => {
    const mealPlansStatus: Record<string, boolean> = { ...mealPlansMap };
    for (const user of usersList) {
      const mealPlan = await getMealPlan(user.uid);
      const hasMealPlan = mealPlan !== null; // Checking if user has a meal plan
      mealPlansStatus[user.uid] = hasMealPlan;
    }
    setMealPlansMap(mealPlansStatus);
  };

  // Custom debounce function
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Debounced search handler
  const handleSearchDebounced = useCallback(
    debounce((query: string) => {
      setSearching(true);
      fetchUsers(query).finally(() => setSearching(false));
    }, 1000),
    []
  );

  // Handle search input change
  const handleSearch = (text: string) => {
    setSearchTerm(text);
    handleSearchDebounced(text.trim());
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <ActivityIndicator style={{ margin: 10 }} />;
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBox}
        placeholder="Buscar usuarios"
        value={searchTerm}
        onChangeText={handleSearch}
      />
      <View style={{ flex: 1, width: "100%" }}>
        {loading || searching ? (
          <View style={{ flex: 1, borderWidth: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <FlatList
            style={{ width: "100%", padding: 20 }}
            data={users}
            keyExtractor={(item) => item.uid}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Link
                  href={{
                    pathname: `/nutritionistDrawer/students/[id]`,
                    params: { id: item.uid },
                  }}
                // asChild
                >

                  <View style={{ flex: 1, width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text>{item.displayName}</Text>
                    {mealPlansMap[item.uid] !== undefined && ( // Checking if user has a meal plan
                      <Icon source="exclamation" color="red" size={20} />
                    )}
                  </View>
                </Link>
              </View>
            )}
            onEndReached={fetchMoreUsers}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBox: {
    width: "90%",
    height: 40,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  item: {
    flex: 1,
    width: "100%",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default UsersWithMealPlans;
