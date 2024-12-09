import Exercise from "@/types/Exercise";
import Meal from "@/types/Meal";
import MealPlan from "@/types/MealPlan";
import Routine from "@/types/Routine";
import { User } from "@/types/User";
import firestore from "@react-native-firebase/firestore";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Icon } from "react-native-paper";

// Define the possible resource types as a union type
type ResourceType = "exercises" | "meals" | "meal_plans" | "routines" | "users";

// Define a generic type that extends any resource
type AnyResource = Exercise | Meal | MealPlan | Routine | User;

// Function to fetch a resource based on its type
const getResource = async <T extends AnyResource>(type: ResourceType, id: string): Promise<T | null> => {
    const resource = await firestore().collection(type).doc(id).get();
    return resource.exists ? { ...resource.data(), uid: resource.id } as T : null;
};

// Define the props for ResourceDetail with a generic parameter T
type ResourceDetailProps<T extends AnyResource> = {
    type: ResourceType;
    children: (resource: T | null) => React.ReactNode; // children is a function that takes resource and renders it
};

export default function ResourceDetail<T extends AnyResource>({
    type,
    children,
}: ResourceDetailProps<T>) {
    const params = useLocalSearchParams();
    const resourceId = params.id as string;
    const [resource, setResource] = useState<T | null>(null);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    console.log("ResourceDetail: ", type, resourceId);

    useEffect(() => {
        // Fetch the resource when component mounts
        getResource<T>(type, resourceId)
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
                // Pass the resource to the children function
                children(resource)
            )}

            <TouchableOpacity onPress={() => {
                if (navigation.canGoBack()) {
                    navigation.goBack();
                }
            }} style={{ flexDirection: "row", marginVertical: 20, justifyContent: "flex-start", alignItems: "center" }}>
                <Icon source="arrow-left" color="black" size={24} />
                <Text> Volver</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
