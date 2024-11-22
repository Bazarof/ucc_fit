import ResourceList from "@/components/ResourceList";
import Routine from "@/types/Routine";
import { ReactElement } from "react";
import { Text, View } from "react-native";

const RoutineItem = (item: Routine) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        marginBottom: 10,
        borderRadius: 15,
        padding: 15,
        flexDirection: "row",
      }}
    >
      <View style={{ height: 80, width: 80, backgroundColor: "red" }}></View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          marginHorizontal: 10,
          flex: 0.2,
        }}
      >
        <View
          style={{
            width: 10,
            height: 10,
            backgroundColor: "gray",
            borderColor: "gray",
            borderWidth: 2,
            marginHorizontal: 1,
          }}
        ></View>
        <View
          style={{
            width: 10,
            height: 20,
            // backgroundColor: "gray",
            borderColor: "gray",
            borderWidth: 2,
            marginHorizontal: 1,
          }}
        ></View>
        <View
          style={{
            width: 10,
            height: 30,
            // backgroundColor: "gray",
            borderColor: "gray",
            borderWidth: 2,
            marginHorizontal: 1,
          }}
        ></View>
      </View>

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
          <Text>01:30 hr</Text>
        </View>
      </View>
    </View>
  );
};

export default function TrainerRoutinesIndex() {
  return (
    <ResourceList<Routine>
      collectionName="routines"
      itemRenderer={(item) => <RoutineItem {...item} />}
    />
  );
}
