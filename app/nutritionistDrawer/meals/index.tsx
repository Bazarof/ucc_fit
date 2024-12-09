import ResourceList from "@/components/ResourceList";
import { getCompletedSessions } from "@/services/attendanceService";
import { getStudentsWithoutRoutine } from "@/services/routineService";
import Meal from "@/types/Meal";
import MealPlan from "@/types/MealPlan";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-paper";


const MealItem = (item: Meal) => {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => {
      router.navigate({
        pathname: "/nutritionistDrawer/meals/[id]",
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
        {item.image_url ? <Image source={{
          uri: item.image_url
        }} style={{ width: 100, height: 100, flex: 1 }} /> : <View style={{ height: 80, width: 80, backgroundColor: "gray" }}></View>}

        <View
          style={{
            justifyContent: "center",
            alignItems: "flex-end",
            flexGrow: 1,
            flex: 4
          }}
        >
          <Text style={{ marginBottom: 30, fontWeight: "bold", fontSize: 16 }}>
            {item.name}
          </Text>
          <View >
            <Text style={{ textAlign: "right", }}>{item.description}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function NutritionistDrawerIndex() {
  return (
    <ResourceList<Meal>
      collectionName="meals"
      itemRenderer={(item) => <MealItem {...item} />}
      createRoute={"/nutritionistDrawer/meals/create"}
    />
  );
}
