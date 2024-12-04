import CardView from "@/components/CardView";
import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator, Alert, Text, View, Image } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

const routinesCollection = firestore().collection("routines");

const fetchRoutine = async (id: string) => {
  const routine = await routinesCollection.doc(id).get();

  // fetch routine.exercises and map them back to the routine object
  const routineData = routine.data();
  if (!routineData) {
    return null;
  }

  const exercisesData = await Promise.all(
    routineData.exercises.map(async (exerciseRef: FirebaseFirestoreTypes.DocumentReference) => {
      const exerciseDoc = await exerciseRef.get();
      return exerciseDoc.exists
        ? { id: exerciseDoc.id, ...exerciseDoc.data() }
        : null;
    })
  );

  routineData.exercises = exercisesData;

  return routineData;
};

const Routine = () => {
  const params = useLocalSearchParams();
  const routineId = params.id as string;
  const [routine, setRoutine] = useState<any>(null);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutine(routineId)
      .then((routine) => {
        console.log(routine);
        setRoutine(routine);
      })
      .catch((error) => {
        console.error(error);
        // go back with alert
        navigation.goBack();
        Alert.alert("Error", "No se pudo cargar la rutina.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [routineId]);

  return (
    <ScrollView contentContainerStyle={{paddingTop: 10}}>
      {loading ? (
        <ActivityIndicator color={'#007FAF'} size="large" />
      ) : (
          <>

            <CardView>

              <View style={[styles.container, { marginBottom: 20 }]}>
                <Text style={[styles.title]}>{routine.name}</Text>
              </View>

              <View style={[styles.container]}>
                <Text style={[{fontSize: 26, fontWeight: 'bold'}]}>Descripción</Text>
                <Text style={styles.text}>{routine.description}</Text>
              </View>

            </CardView>

            <View style={[styles.container, styles.exerciseListContainer]}>
              {routine.exercises.map((exercise: any) => (
                <TouchableOpacity key={exercise.id} style={styles.exerciseContainer} onPress={()=>{
                  router.navigate({pathname: '/studentDrawer/(tabs)/rutinas/description/[id]', params: {id: exercise.id}});
                }}>
                  <View style={[styles.container, { alignItems: 'center' }]}>
                    <Image style={{ width: 180, height: 120 }} source={{ uri: exercise.image_url }} />
                  </View>
                  <View>
                    <Text style={styles.subtitle}>{exercise.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}

            </View>
          </>

      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  exerciseListContainer: {
    paddingTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  exerciseContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'white',
    width: 175,
    height: 170,
    borderRadius: 10,
    elevation: 2 
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  header2:{
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
  }
});

export default Routine;
