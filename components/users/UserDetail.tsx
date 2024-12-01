import { getMealPlan } from "@/services/mealPlanService";
import { assignRoutineToUser, getAllRoutines, getRoutine } from "@/services/routineService";
import { getUser } from "@/services/userService";
import MealPlan from "@/types/MealPlan";
import Routine from "@/types/Routine";
import { User } from "@/types/User";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSession } from "../session/SessionProvider";
import { SelectList } from "react-native-dropdown-select-list";

const UserRow = ({ label, value }: { label: string; value: string }) => (
    <View style={{ flexDirection: "row", marginBottom: 5 }}>
        <Text style={{ flex: 0.3, fontWeight: "bold" }}>{label}: </Text>
        <Text style={{ flex: 0.7 }}>{value}</Text>
    </View>
);

const roles = {
    student: "Estudiante",
    trainer: "Entrenador",
    admin: "Administrador",
    nutritionist: "Nutriólogo",
};


export const UserDetail = () => {
    const params = useLocalSearchParams();
    const userId = params.id as string;
    const [user, setUser] = useState<User | null>(null);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [latestRoutine, setLatestRoutine] = useState<Routine | null>(null);
    const [latestMealPlan, setLatestMealPlan] = useState<MealPlan | null>(null);
    const [allRoutines, setAllRoutines] = useState<Routine[]>([]);

    const { session } = useSession();

    const [selectedRoutineUID, setSelectedRoutineUID] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        getUser(userId)
            .then((user) => {
                console.log(user);
                setUser(user);
            })
            .catch((error) => {
                console.error(error);
                navigation.goBack();
                Alert.alert("Error", "No se pudo cargar el usuario.");
            })
            .finally(() => {
                setLoading(false);
            });

        getRoutine(userId).then((routine) => {
            setLatestRoutine(routine);
        })

        getMealPlan(userId).then((mealPlan) => {
            setLatestMealPlan(mealPlan);
        })

        getAllRoutines().then((routines) => {
            setAllRoutines(routines);
        })
    }, [userId]);

    return (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <>
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{user?.displayName}</Text>
                    <Text style={{ marginBottom: 15 }}>{roles[user?.role ?? "student"]}</Text>

                    <UserRow label="Email" value={user?.email ?? ""} />
                    <UserRow label="Ultima rutina " value={latestRoutine?.name ?? "---"} />
                    <UserRow label="Ultimo plan alimenticio" value={latestMealPlan?.name ?? "---"} />

                    <Text style={{ marginTop: 10 }}>Asignar rutina</Text>

                    <SelectList
                        data={allRoutines.map((routine) => ({
                            key: routine.uid,
                            value: routine.name,
                        }))}
                        save="key"
                        setSelected={setSelectedRoutineUID}
                        searchPlaceholder="Buscar rutina"
                        placeholder="Rutina"
                        boxStyles={{ marginTop: 10 }}
                        inputStyles={{ color: "gray" }}
                    />

                    <TouchableOpacity
                        style={{
                            backgroundColor: "#007FAF",
                            padding: 10,
                            borderRadius: 5,
                            marginTop: 10,
                        }}
                        onPress={async () => {
                            try {
                                await assignRoutineToUser(userId, selectedRoutineUID ?? "");
                                Alert.alert("Éxito", "Rutina asignada correctamente.");
                                router.back();
                            } catch (error) {
                                console.error(error);
                                Alert.alert("Error", "No se pudo asignar la rutina.");
                            }
                        }}
                    >
                        <Text style={{ color: "white" }}>Asignar rutina</Text>
                    </TouchableOpacity>
                </>
            )}
        </ScrollView>
    );
};

export default UserDetail;
