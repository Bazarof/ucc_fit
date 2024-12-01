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
import { getUserCurrentRoutine } from "@/services/routineService";

const studentsCollection = firestore().collection("users");

const Students = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] =
    useState<FirebaseFirestoreTypes.QueryDocumentSnapshot | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [routinesMap, setRoutinesMap] = useState<Record<string, boolean>>({});

  // Fetch initial students
  const fetchStudents = async (query = "") => {
    setLoading(true);

    let querySnapshot = studentsCollection.where("role", "==", "student");
    if (query) {
      querySnapshot = querySnapshot
        .where("displayName", ">=", query)
        .where("displayName", "<=", query + "\uf8ff");
    }

    const snapshot = await querySnapshot.limit(10).get();
    const studentsList = snapshot.docs.map(
      (doc) =>
      ({
        uid: doc.id,
        ...doc.data(),
      } as unknown as User)
    );

    setStudents(studentsList);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    setLoading(false);

    fetchRoutinesForStudents(studentsList);
  };

  // Fetch more students for pagination
  const fetchMoreStudents = async () => {
    if (loadingMore || !lastDoc || searching) return;
    setLoadingMore(true);

    const snapshot = await studentsCollection
      .startAfter(lastDoc)
      .limit(10)
      .where("role", "==", "student")
      .get();

    const moreStudents = snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    }) as User);

    setStudents((prev) => [...prev, ...moreStudents]);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    setLoadingMore(false);

    fetchRoutinesForStudents(moreStudents);
  };

  // Fetch routine status for each student
  const fetchRoutinesForStudents = async (studentsList: User[]) => {
    const routinesStatus: Record<string, boolean> = { ...routinesMap };
    for (const student of studentsList) {
      const hasRoutine = (await getUserCurrentRoutine(student.uid)) !== null;
      routinesStatus[student.uid] = hasRoutine;
    }
    setRoutinesMap(routinesStatus);
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
      fetchStudents(query).finally(() => setSearching(false));
    }, 1000),
    []
  );

  // Handle search input change
  const handleSearch = (text: string) => {
    setSearchTerm(text);
    handleSearchDebounced(text.trim());
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
      <TextInput
        style={styles.searchBox}
        placeholder="Search students by name"
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
                  <Text>
                    {item.displayName}{" "}
                    {routinesMap[item.uid] !== undefined &&
                      (routinesMap[item.uid] ? "(Has Routine)" : "(No Routine)")}
                  </Text>
                </Link>
              </View>
            )}
            onEndReached={fetchMoreStudents}
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
    borderRadius: 8
  },
  item: {
    flex: 1,
    width: "100%",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default Students;
