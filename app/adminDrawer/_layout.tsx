import CustomDrawerContent from "@/components/navigation/CustomAdminDrawerContent";
import Drawer from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <GestureHandlerRootView>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
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
            title: "Admin",
          }}
        />
        <Drawer.Screen
          name="users"
          options={{
            title: "Usuarios",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
