import ResourceList from "@/components/ResourceList";
import MealPlan from "@/types/MealPlan";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";


['Perder peso', 'Ganar peso', 'Ganar masa muscular', 'Mantener peso', 'Mejorar salud']
const getMealPlanImage = (mealPlan: MealPlan) => {
  switch (mealPlan.objective) {
    case 'Perder peso':
      return require('@/assets/images/lose_weight.png');
    case 'Ganar peso':
      return require('@/assets/images/gain_weight.png');
    case 'Ganar masa muscular':
      return require('@/assets/images/muscle.png');
    case 'Mantener peso':
      return require('@/assets/images/keep_weight.jpg');
    default:
      return require('@/assets/images/health_fitness.jpg');;
  }
}

const MealPlanItem = (item: MealPlan) => {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => {
      router.navigate({
        pathname: "/nutritionistDrawer/mealplans/[id]",
        params: {
          id: item.uid
        },
      });
    }}>
      <View
        style={{
          backgroundColor: "white",
          marginBottom: 10,
          borderRadius: 15,
          padding: 15,
          flexDirection: "row",
        }}
      >
        <Image source={getMealPlanImage(item)} style={{ height: 80, width: 80 }} />

        <View
          style={{
            justifyContent: "center",
            alignItems: "flex-end",
            flexGrow: 1,
          }}
        >
          <Text style={{ marginBottom: 30, fontWeight: "bold", fontSize: 16 }}>
            {item.name}
          </Text>
          <View>
            <Text>{item.description}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function NutritionistDrawerIndex() {
  return (
    <ResourceList<MealPlan>
      collectionName="meal_plans"
      itemRenderer={(item) => <MealPlanItem {...item} />}
      createRoute={"/nutritionistDrawer/mealplans/create"}
    />
  );
}
