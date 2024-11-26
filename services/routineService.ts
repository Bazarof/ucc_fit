import Routine from "@/types/Routine";
import { getFirestore } from "@react-native-firebase/firestore";

export const getRoutine = async (id: string): Promise<Routine> => {
    const routineDoc = await getFirestore()
        .collection("routines")
        .doc(id)
        .get();
    return routineDoc.data() as Routine;
}

export const getStudentsWithoutRoutine = async (): Promise<number> => {
    try {
        // Step 1: Fetch all users with role "student"
        const usersSnapshot = await getFirestore()
            .collection("users")
            .where("role", "==", "student")
            .get();

        const studentUsers = usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Step 2: Fetch all routines and map user references
        const routinesSnapshot = await getFirestore().collection("routines").get();
        const usersWithRoutines = routinesSnapshot.docs.map(
            (doc) => doc.data().user // Extract the `user` field from routines
        );

        // Step 3: Filter out students without routines
        const studentsWithoutRoutines = studentUsers.filter(
            (student) => !usersWithRoutines.includes(`/users/${student.id}`)
        );

        return studentsWithoutRoutines.length;
    } catch (error) {
        console.error("Error fetching students without routines:", error);
        return 0;
    }
};

export const createRoutine = async (routine: Routine): Promise<void> => {
    try {
        await getFirestore().collection("routines").add(routine);
    } catch (error) {
        console.error("Error creating routine:", error);
    }
}

