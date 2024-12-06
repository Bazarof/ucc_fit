import { getCompletedSessions } from "@/services/attendanceService";
import { getStudentsWithoutRoutine } from "@/services/routineService";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Icon } from "react-native-paper";

interface CardProps {
  title: string;
  value: number;
  unit: string;
  description: string;
  icon: string;
  iconColor: string;
}

function Card({ title, value, unit, description }: CardProps) {
  return <View style={{ backgroundColor: "white", margin: 5, borderRadius: 15, padding: 15, flex: 1 }}>
    <Text style={{ fontSize: 18 }}>{title}</Text>
    <View style={{ flexDirection: "row", padding: 5 }}>
      <Icon source="alert" size={30} color="red" />
      <View style={{ paddingLeft: 5 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{value} {unit}</Text>
        <Text>{description}</Text>
      </View>
    </View>
  </View>
}

export default function NutritionistDrawerIndex() {
  const [loading, setLoading] = useState(true);
  const [studentsWithoutRoutine, setStudentsWithoutRoutine] = useState(0);
  const [attendance, setAttendance] = useState(0);


  useEffect(() => {
    getStudentsWithoutRoutine()
      .then((students) => {
        setStudentsWithoutRoutine(students);
        console.log("Students without routine: ", studentsWithoutRoutine);
      })
      .catch((error) => {
        console.error(error);
      }).finally(() => {
        setLoading(false);
      });

    getCompletedSessions().then((sessions) => {
      setAttendance(sessions);
    }).catch((error) => {
      console.error(error);
    }).finally(() => {
      setLoading(false);
      console.log("Attendance: ", attendance);
    });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />
  }

  return <View style={{ flex: 1, margin: 20 }}>

    <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>Resumen</Text>

    <View style={{ flexDirection: "row" }}>
      <Card title="Asistencias" value={attendance} unit="sesiones" description="este mes" icon="alert" iconColor="red" />
      <Card title="Rutinas" value={studentsWithoutRoutine} unit="estudiantes" description="sin rutina" icon="alert" iconColor="red" />
    </View>

  </View>
}
