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
        const firestore = getFirestore();

        // Step 1: Fetch all users with role "student"
        const usersSnapshot = await firestore
            .collection("users")
            .where("role", "==", "student")
            .get();

        const studentUsers = usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Step 2: Fetch all user_routine entries and extract user_uids
        const userRoutinesSnapshot = await firestore.collection("user_routine").get();
        const usersWithRoutines = userRoutinesSnapshot.docs.map(
            (doc) => doc.data().user_uid // Extract `user_uid` from user_routine
        );

        // Step 3: Filter out students without routines
        const studentsWithoutRoutines = studentUsers.filter(
            (student) => !usersWithRoutines.includes(student.id)
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

export const getUserCurrentRoutine = async (userId: string): Promise<Routine | null> => {
    try {
        console.log("userId", userId);

        const firestore = getFirestore();

        // Step 1: Query the most recent entry in the `user_routine` collection for the given userId
        const userRoutineSnapshot = await firestore
            .collection("user_routine")
            .where("user_uid", "==", userId)
            .orderBy("created_at", "desc") // Order by `created_at` in descending order
            .limit(1) // Get only the most recent entry
            .get();

        if (userRoutineSnapshot.empty) {
            return null;
        }

        // Step 2: Extract the routine_uid from the most recent user_routine entry
        const userRoutine = userRoutineSnapshot.docs[0].data();
        const routineId = userRoutine.routine_uid;

        // Step 3: Fetch the routine details from the `routines` collection
        const routineSnapshot = await firestore
            .collection("routines")
            .doc(routineId)
            .get();

        if (!routineSnapshot.exists) {
            return null;
        }

        return routineSnapshot.data() as Routine;
    } catch (error) {
        console.error("Error fetching user's current routine:", error);
        return null;
    }
};


export const getAllRoutines = async (): Promise<Routine[]> => {
    try {
        const routinesSnapshot = await getFirestore().collection("routines").get();
        return routinesSnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }) as Routine);
    } catch (error) {
        console.error("Error fetching all routines:", error);
        return [];
    }
}

export const assignRoutineToUser = async (userId: string, routineId: string): Promise<void> => {
    try {
        await getFirestore().collection("user_routine").add({
            user_uid: userId,
            routine_uid: routineId,
            created_at: new Date(),
        });
    } catch (error) {
        console.error("Error assigning routine to user:", error);
    }
}