import { useSession } from "@/components/session/SessionProvider";
import { getMealPlan } from "@/services/mealPlanService";
import Exercise from "@/types/Exercise";
import Meal from "@/types/Meal";
import MealPlan from "@/types/MealPlan";
import Routine from "@/types/Routine";
import { User } from "@/types/User";
import firestore from "@react-native-firebase/firestore";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Key, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Icon } from "react-native-paper";

// Define the possible resource types as a union type
type ResourceType = "exercises" | "meals" | "meal_plans" | "routines" | "users";

// Define a generic type that extends any resource
type AnyResource = Exercise | Meal | MealPlan | Routine | User;

// Function to fetch a resource based on its type
const getResource = async <T extends AnyResource>(
  type: ResourceType,
  id: string
): Promise<T | null> => {
  const resource = await firestore().collection(type).doc(id).get();
  return resource.exists
    ? ({ ...resource.data(), uid: resource.id } as T)
    : null;
};

// Define the props for ResourceDetail with a generic parameter T
type ResourceDetailProps<T extends AnyResource> = {
  type: ResourceType;
  children: (resource: T | null) => React.ReactNode; // children is a function that takes resource and renders it
};

const weekdays = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const mealTypes = {
  breakfast: "Desayuno",
  lunch: "Almuerzo",
  dinner: "Cena",
  snack: "Colación",
};

export default function ResourceDetail<T extends AnyResource>({
  type,
  children,
}: ResourceDetailProps<T>) {
  // const params = useLocalSearchParams();

  const [resourceId, setResourceId] = useState<string | null>(null);
  // const resourceId = params.id as string;
  const [resource, setResource] = useState<any>(null);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  console.log("ResourceDetail: ", type, resourceId);

  const { session } = useSession();

  useEffect(() => {
    getMealPlan(session!.uid).then((mealPlan) => {
      setResourceId(mealPlan!.uid);
    });

    // Fetch the resource when component mounts
    getResource("meal_plans", resourceId as string)
      .then((resourceData) => {
        setResource(resourceData);
      })
      .catch((error) => {
        navigation.goBack();
        Alert.alert("Error", "No se pudo cargar el recurso.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [resourceId, type]);

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Text style={styles.title}>{resource?.name}</Text>
          <Text style={styles.description}>{resource?.description}</Text>
          <Text style={styles.objective}>
            Objetivo:{" "}
            <Text style={styles.highlight}>{resource?.objective}</Text>
          </Text>

          {/* Meals Section */}
          <Text style={styles.sectionTitle}>Comidas:</Text>
          {(resource as any)?.meal_select?.length ? (
            (resource as any)?.meal_select.map(
              (meal: any, index: Key | null | undefined) => (
                <View key={index} style={styles.mealItem}>
                  <Text style={styles.mealName}>
                    {(meal as any).meal} (
                    {mealTypes[meal.type as keyof typeof mealTypes]})
                  </Text>
                  <Text style={styles.weekday}>
                    Día: {weekdays[parseInt((meal as any).weekday)]}
                  </Text>
                </View>
              )
            )
          ) : (
            <Text style={styles.emptyMessage}>No hay comidas asignadas</Text>
          )}
        </>

        //     </>
        //   )}
        // </ResourceDetail>
        //   );
      )}

      <TouchableOpacity
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
        style={{
          flexDirection: "row",
          marginVertical: 20,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Icon source="arrow-left" color="black" size={24} />
        <Text> Volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// import ResourceDetail from "@/components/ResourceDetail";
// import MealPlan from "@/types/MealPlan";
// import { Key } from "react";
// import { Text, View, StyleSheet } from "react-native";

// export default function MealDetail() {
//   // Weekday Mapping

// }

// Styles
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    color: "#666",
  },
  objective: {
    fontSize: 16,
    marginBottom: 10,
  },
  highlight: {
    fontWeight: "bold",
    color: "#000",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  mealItem: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  weekday: {
    fontSize: 14,
    color: "#555",
  },
  emptyMessage: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});
