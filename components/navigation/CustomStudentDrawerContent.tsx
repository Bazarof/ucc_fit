import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { usePathname, router } from "expo-router";
import { useEffect } from "react";
import { View, Text, Image, Pressable } from "react-native";

export default function CustomDrawerContent(props: any) {

  const pathName = usePathname();

  return (
    <View style={{
      flex: 1,
    }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#007faf' }}>
        <View
          style={{
            flex: 1,
            height: 53,
          }}>
          <Text style={{
            fontSize: 35,
            fontWeight: 'bold',
            color: '#fff',
            paddingStart: 16,
            }}>
              UCC Fit
          </Text>
        </View>
        <View
          style={{
            backgroundColor: '#fff'
          }}>
          <DrawerItem
            icon={() => (
              <Image
                style={{
                  width: 30,
                  height: 30,
                }}
                source={require('../../assets/images/icons/home.png')} />
            )}
            label={"Inicio"}
            labelStyle={{ fontSize: 20, color: '#000' }}
            onPress={() => {
              router.push("/studentDrawer");
            }}
            style={{
              marginTop: 15,
              backgroundColor: pathName === '/home' ? '#E3E3E3' : '#fff',
            }}
            />
          <DrawerItem
            icon={() => (
              <Image
                style={{
                  width: 30,
                  height: 30
                }}
                source={require('../../assets/images/icons/dumbell.png')} />
            )}
            label={"Rutinas"}
            labelStyle={{ fontSize: 20, color: '#000' }}
            onPress={() => {
              router.push('/studentDrawer/rutinas')
            }}
            style={{
              backgroundColor: pathName === '/rutina' ? '#E3E3E3' : '#fff',
            }}
          />

          <DrawerItem
            icon={() => (
              <Image
                style={{
                  width: 30,
                  height: 30
                }}
                source={require('../../assets/images/icons/cutlery.png')} />
            )}
            label={"Plan alimenticio"}
            labelStyle={{ fontSize: 20, color: '#000' }}
            onPress={() => {
              router.push('/studentDrawer/planalimenticio')
            }}
            style={{
              backgroundColor: pathName === '/planalimenticio' ? '#E3E3E3' : '#fff',
            }}
          />
          <DrawerItem
            icon={() => (
              <Image
                style={{
                  width: 30,
                  height: 30
                }}
                source={require('../../assets/images/icons/bar-graph.png')} />
            )}
            label={"Estadísticas"}
            labelStyle={{ fontSize: 20, color: '#000' }}
            onPress={() => {
              router.push('/studentDrawer/estadisticas')
            }}
            style={{
              backgroundColor: pathName === '/estadisticas' ? '#E3E3E3' : '#fff',
            }}
          />
        </View>

      </DrawerContentScrollView>
      <View style={{
        justifyContent: 'flex-end',
        width: '100%',
        flexDirection: 'row',
        borderTopColor: '#dde3fe',
        borderTopWidth: 1,
        padding: 20,
        marginBottom: 40,
      }}>
        <Pressable style={{ alignContent: 'flex-end' }} onPress={() => { router.push('/studentDrawer/configuracion') }}>
          <Image
            style={{
              height: 30,
              width: 30,
            }}
            source={require('../../assets/images/icons/setting.png')} />
        </Pressable>
      </View>
    </View>
  );
}