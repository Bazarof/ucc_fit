import ResourceDetail from "@/components/ResourceDetail";
import MealPlan from "@/types/MealPlan";
import { Text } from "react-native";

export default function MealDetail() {
    return <ResourceDetail<MealPlan> type="meals">
        {(resource) => (
            <>
                <Text style={{ fontSize: 18 }}>{resource?.name}</Text>
                <Text>{resource?.description}</Text>
                {/* Render other properties of the Meal resource */}
            </>
        )}
    </ResourceDetail>
}