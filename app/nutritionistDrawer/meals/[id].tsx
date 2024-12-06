import ResourceDetail from "@/components/ResourceDetail";
import Meal from "@/types/Meal";
import { Text } from "react-native";

export default function MealDetail() {
    return <ResourceDetail<Meal> type="meals">
        {(resource) => (
            <>
                <Text style={{ fontSize: 18 }}>{resource?.name}</Text>
                <Text>{resource?.description}</Text>
                {/* Render other properties of the Meal resource */}
            </>
        )}
    </ResourceDetail>
}