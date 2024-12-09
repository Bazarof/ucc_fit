import ResourceDetail from "@/components/ResourceDetail";
import Meal from "@/types/Meal";
import { Text, Image } from "react-native";

export default function MealDetail() {
    return <ResourceDetail<Meal> type="meals">
        {(resource) => (
            <>
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>{resource?.name}</Text>
                <Text style={{ marginVertical: 15 }}>{resource?.description}</Text>

                <Image source={{ uri: resource?.image_url }} style={{ width: 250, height: 250, alignSelf: "center", borderRadius: 15 }} />
            </>
        )}
    </ResourceDetail>
}