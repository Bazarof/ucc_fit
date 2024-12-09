import { getCompletedSessions } from "@/services/attendanceService";
import { getDateofLastPlan, getUsersWithMealPlan, getUsersWithoutMealPlan } from "@/services/mealPlanService";
import { getStudentsWithoutRoutine } from "@/services/routineService";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Icon } from "react-native-paper";

interface CardProps {
  title: string;
  value: string;
  unit: string;
  description: string;
  icon: string;
  iconColor: string;
}

function Card({ title, value, unit, icon, iconColor, description }: CardProps) {
  return <View style={{ backgroundColor: "white", margin: 5, borderRadius: 15, padding: 15, flex: 1 }}>
    <Text style={{ fontSize: 18 }}>{title}</Text>
    <View style={{ flexDirection: "row", padding: 5 }}>
      <Icon source={icon} size={30} color={iconColor} />
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

  const [usersWithoutMealPlan, setUsersWithoutMealPlan] = useState(0);
  const [usersWithMealPlan, setUsersWithMealPlan] = useState(0);
  const [dateOfLastPlan, setDateOfLastPlan] = useState<Date>();

  useEffect(() => {
    getUsersWithoutMealPlan().then((users) => {
      setUsersWithoutMealPlan(users);
    }).catch((error) => {
      console.error(error);
    }).finally(() => {
      setLoading(false);
    });

    getUsersWithMealPlan().then((users) => {
      setUsersWithMealPlan(users);
    }).catch((error) => {
      console.error(error);
    }).finally(() => {
      setLoading(false);
    });

    getDateofLastPlan().then((date) => {
      setDateOfLastPlan(date);
    }).catch((error) => {
      console.error(error);
    }).finally(() => {
      setLoading(false);
    });

  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />
  }

  return <View style={{ flex: 1, margin: 20 }}>

    <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>Resumen</Text>

    <View style={{ flexDirection: "row" }}>
      <Card title='Usuarios con plan' value={usersWithMealPlan.toString()} unit='estudiantes' description='atendidos' icon='check' iconColor='green' />
      <Card title="Usuarios sin plan" value={usersWithoutMealPlan.toString()} unit="estudiantes" description="sin plan" icon="alert" iconColor="red" />
    </View>

    <View style={{ flexDirection: "row" }}>
      <Card title="Actividad" value={dateOfLastPlan?.toLocaleDateString('es-MX') ?? 'N/A'} unit="" description="Último plan creado" icon="calendar" iconColor="blue" />
    </View>

  </View>
}
