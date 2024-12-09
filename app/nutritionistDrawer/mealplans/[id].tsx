import ResourceDetail from "@/components/ResourceDetail";
import MealPlan from "@/types/MealPlan";
import { Text } from "react-native";

export default function MealDetail() {
    return (
      <ResourceDetail<MealPlan> type="meal_plans">
        {(resource) => (
          <>
            <Text style={{ fontSize: 18 }}>{resource?.name}</Text>
            <Text>{resource?.description}</Text>
          </>
        )}
      </ResourceDetail>
    );
}