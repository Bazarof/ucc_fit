import { collection, getFirestore } from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

const MealSelect = ({ onUpdate }: any) => {
    const [mealArray, setMealArray] = useState<any[]>([]);
    const [mealOptions, setMealOptions] = useState<any[]>([]);

    useEffect(() => {
        collection(getFirestore(), "meals")
            .get()
            .then((querySnapshot) => {
                const options = querySnapshot.docs.map((doc) => doc.data());

                const mappedOptions = options.map((option: any) => ({
                    key: option.uid,
                    value: option.name,
                }));

                setMealOptions(mappedOptions);
            });
    }, []);

    const handleAddMeal = () => {
        setMealArray([
            ...mealArray,
            { meal: "", type: "", weekday: "" }, // Add a blank row
        ]);
    };

    const handleDeleteMeal = (index: number) => {
        const updatedArray = [...mealArray];
        updatedArray.splice(index, 1); // Remove the meal at the given index
        setMealArray(updatedArray);
        onUpdate(updatedArray); // Notify parent of changes
    };

    const handleUpdateMeal = (index: number, key: string, value: string) => {
        const updatedArray = [...mealArray];
        updatedArray[index][key] = value; // Update the field in the specified row
        setMealArray(updatedArray);
        onUpdate(updatedArray); // Notify parent of changes
    };

    return (
        <View>
            <FlatList
                data={mealArray}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.row}>
                        <SelectList
                            data={mealOptions}
                            setSelected={(value: string) => handleUpdateMeal(index, "meal", value)}
                            save="key"
                            placeholder="Comida"
                        />

                        <SelectList
                            data={[
                                { key: "breakfast", value: "Desayuno" },
                                { key: "lunch", value: "Comida" },
                                { key: "dinner", value: "Cena" },
                                { key: "snack", value: "Aperitivo" },
                            ]}
                            setSelected={(value: string) => handleUpdateMeal(index, "type", value.toLowerCase())}
                            placeholder="Tipo"
                            search={false}
                            save="key"
                        />

                        <SelectList
                            data={[
                                { key: "0", value: "L" },
                                { key: "1", value: "M" },
                                { key: "2", value: "M" },
                                { key: "3", value: "J" },
                                { key: "4", value: "V" },
                                { key: "5", value: "S" },
                                { key: "6", value: "D" },
                            ]}
                            setSelected={(value: string) => handleUpdateMeal(index, "weekday", value.toLowerCase())}
                            placeholder="Día"
                            save="key"
                            search={false}
                        />

                        {/* <TextInput
                            style={styles.textInput}
                            placeholder="Weekday"
                            value={item.weekday}
                            onChangeText={(value) => handleUpdateMeal(index, "weekday", value)}
                        /> */}
                        <TouchableOpacity onPress={() => handleDeleteMeal(index)} style={styles.deleteButton}>
                            <Text style={styles.deleteButtonText}>X</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
            <TouchableOpacity onPress={handleAddMeal} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Añadir comida</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 8,
        flex: 1,
        marginHorizontal: 5,
    },
    deleteButton: {
        backgroundColor: "red",
        padding: 8,
        borderRadius: 5,
        width: 30,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    deleteButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    addButton: {
        backgroundColor: "green",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },
    addButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default MealSelect;
