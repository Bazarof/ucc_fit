import ResourceDetail from "@/components/ResourceDetail";
import MealPlan from "@/types/MealPlan";
import { Key } from "react";
import { Text, View, StyleSheet } from "react-native";

export default function MealDetail() {
  // Weekday Mapping
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

  return (
    <ResourceDetail<MealPlan> type="meal_plans">
      {(resource) => (
        <>
          {/* Meal Plan Header */}
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
      )}
    </ResourceDetail>
  );
}

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
