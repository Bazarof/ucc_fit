import { getAllExercises } from "@/services/exerciseService";
import { createRoutine } from "@/services/routineService";
import {
  doc,
  collection,
  getFirestore,
} from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MultipleSelectList } from "react-native-dropdown-select-list";

interface SelectListOption {
  key: string;
  value: string;
}

export default function CreateRoutine() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [allExercises, setAllExercises] = useState<SelectListOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<SelectListOption[]>([]);

  useEffect(() => {
    getAllExercises()
      .then((exercises) => {
        const mappedExercises = exercises.map((exercise) => ({
          key: exercise.uid,
          value: exercise.name,
        }));

        setAllExercises(mappedExercises);
        console.log(mappedExercises);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  console.log("selected exercises: ", exercises);

  return (
    <View
      style={{
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Crear rutina</Text>

      <TextInput
        value={name}
        onChangeText={(text) => setName(text)}
        placeholder="Nombre"
        style={styles.textInput}
      />

      <TextInput
        value={description}
        onChangeText={(text) => setDescription(text)}
        placeholder="Descripción"
        style={styles.textInput}
      />

      <MultipleSelectList
        data={allExercises}
        setSelected={setExercises}
        save="key"
        searchPlaceholder="Seleccionar ejercicios"
        placeholder="Ejercicios"
        label="Ejercicios"
        boxStyles={{ marginTop: 10 }}
        inputStyles={{ color: "gray" }}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          try {
            if (exercises.length === 0) {
              Alert.alert("Error", "Debe seleccionar al menos un ejercicio.");
              return;
            }

            if (!name || !description) {
              Alert.alert("Error", "Debe completar todos los campos.");
              return;
            }

            const routineImages = [
              "https://firebasestorage.googleapis.com/v0/b/ucc-fit.firebasestorage.app/o/calentamiento.png?alt=media&token=1fa3a2c2-352d-4207-a7b4-07990d8517ba",
              "https://firebasestorage.googleapis.com/v0/b/ucc-fit.firebasestorage.app/o/upper-body.png?alt=media&token=3d1a9c5f-c48a-43e0-8250-97bf78702ff1",
              "https://firebasestorage.googleapis.com/v0/b/ucc-fit.firebasestorage.app/o/lower-body.png?alt=media&token=529d077c-8e04-4165-9ae3-5f98b8854578",
            ];

            console.log("AUXILIO", exercises);

            const routine: any = {
              name,
              description,
              exercises: exercises.map((exercise) =>
                doc(collection(getFirestore(), "exercises"), exercise.key)
              ),
              image_url:
                routineImages[Math.floor(Math.random() * routineImages.length)],
            };

            console.log(routine);

            await createRoutine(routine);
            Alert.alert("Éxito", "Rutina creado correctamente.");

            router.push("/trainerDrawer/routines");
          } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo crear la rutina.");
          } finally {
          }
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Crear</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#007FAF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  }
});
