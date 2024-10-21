import CustomDrawerContent from "@/components/navigation/CustomDrawerContent";
import Drawer from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";



export default function Layout() {
  return (
    <GestureHandlerRootView>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props}/>}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007faf',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerTitleStyle: {fontSize: 30},
        }}>
        <Drawer.Screen
          name="(tabs)/index"
          options={{
            title: 'Inicio',
          }}/>
        <Drawer.Screen
          name="(tabs)/rutina"
          options={{
            title: 'Rutina'
          }}/>
        <Drawer.Screen
          name="(tabs)/planalimenticio"
          options={{
            title: 'Plan Alimenticio'
          }}/>
        <Drawer.Screen
          name="(tabs)/estadisticas"
          options={{title: 'Estadísticas',
          }}/>
        <Drawer.Screen
          name="(tabs)/configuracion"
          options={{title: 'Configuracion'
          }}/>
      </Drawer>

    </GestureHandlerRootView>
  );
}