import CustomNutritionistDrawerContent from "@/components/navigation/CustomNutritionistDrawerContent";
import Drawer from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <GestureHandlerRootView>
      <Drawer
        drawerContent={(props) => <CustomNutritionistDrawerContent {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: "#007faf",
          },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 30 },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: "Nutriólogo",
          }}
        />
        <Drawer.Screen
          name="students"
          options={{
            title: "Estudiantes",
          }}
        />

        <Drawer.Screen
          name="mealplans"
          options={{
            title: "Planes",
          }}
        />

        <Drawer.Screen
          name="meals"
          options={{
            title: "Comidas",
          }}
        />

        <Drawer.Screen
          name="configuracion"
          options={{
            title: "Configuración",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
