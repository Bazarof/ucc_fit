import { createExercise } from "@/services/exerciseService";
import Exercise from "@/types/Exercise";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { Button, Menu, TextInput as TextInputPaper } from "react-native-paper";

const muscleGroups = [
  { key: "chest", value: "Pecho" },
  { key: "back", value: "Espalda" },
  { key: "shoulders", value: "Hombros" },
  { key: "legs", value: "Piernas" },
  { key: "arms", value: "Brazos" },
];

export default function CreateExercise() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [muscleGroupMenuVisible, setMuscleGroupMenuVisible] = useState(false);
  const [muscleGroup, setMuscleGroup] = useState("");

  const router = useRouter();

  return (
    <View
      style={{
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Crear ejercicio</Text>

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

      <SelectList
        data={muscleGroups}
        setSelected={setMuscleGroup}
        save="value"
        searchPlaceholder="Buscar grupo muscular"
        placeholder="Grupo muscular"
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
            const exercise: Exercise = {
              uid: "",
              name,
              muscleGroup: muscleGroup as
                | "chest"
                | "back"
                | "shoulders"
                | "legs"
                | "arms",
              image_url: "",
              description,
            };
            await createExercise(exercise);
            Alert.alert("Éxito", "Ejercicio creado correctamente.");
          } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo crear el ejercicio.");
          } finally {
            router.push("/trainerDrawer/exercises");
          }
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Create</Text>
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
});
