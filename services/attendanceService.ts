import Attendance from "@/types/Attendance";
import { getFirestore } from "@react-native-firebase/firestore";
// import { firestore } from "./firebase"; // Import Firestore instance

// Define the shape of a session record
interface SessionRecord {
    created_at: Date;
    type: "in" | "out";
    user: string;
}

// Define the function input
interface GetCompletedSessionsParams {
    startMonth?: string; // Expected format: YYYY-MM-DD
    endMonth?: string;   // Expected format: YYYY-MM-DD
}

export async function getCompletedSessions(
    { startMonth, endMonth }: GetCompletedSessionsParams = {}
): Promise<number> {
    const db = getFirestore();
    const now = new Date();

    // Step 1: Calculate default range for the current month
    let startDate: Date;
    let endDate: Date;

    if (startMonth && endMonth) {
        // Parse provided range into Date objects
        startDate = new Date(startMonth);
        endDate = new Date(endMonth);
        // Adjust `endDate` to the last millisecond of the day
        endDate.setHours(23, 59, 59, 999);
    } else {
        // Default to the current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1); // First day of the current month
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the current month
        endDate.setHours(23, 59, 59, 999); // Ensure endDate includes the full day
    }

    // Step 2: Query Firestore for the specified date range
    const sessionQuery = await db
        .collection("attendance") // Replace with your collection name
        .where("created_at", ">=", startDate)
        .where("created_at", "<=", endDate)
        .get();

    const records: SessionRecord[] = [];

    sessionQuery.forEach((doc) => {
        const data = doc.data();
        records.push({
            created_at: data.created_at.toDate(),
            type: data.type,
            user: data.user,
        });
    });

    // Step 3: Group records by user
    const userSessions: Record<
        string,
        { in: Date[]; out: Date[] }
    > = {};

    records.forEach((record) => {
        const { user, type, created_at } = record;

        if (!userSessions[user]) {
            userSessions[user] = { in: [], out: [] };
        }

        // Group records into "in" and "out"
        if (type === "in") {
            userSessions[user].in.push(created_at);
        } else if (type === "out") {
            userSessions[user].out.push(created_at);
        }
    });

    // Step 4: Calculate completed sessions
    let completedSessions = 0;

    Object.values(userSessions).forEach(({ in: ins, out: outs }) => {
        // Sort both "in" and "out" arrays by timestamp
        ins.sort((a, b) => a.getTime() - b.getTime());
        outs.sort((a, b) => a.getTime() - b.getTime());

        let i = 0,
            j = 0;

        // Match each "in" with the closest "out" after it
        while (i < ins.length && j < outs.length) {
            if (outs[j] > ins[i]) {
                completedSessions++;
                i++;
                j++;
            } else {
                j++;
            }
        }
    });

    return completedSessions;
}

export const createAttendance = async (
    studentId: string,
    type: "in" | "out" = "in"
) => {
    const attendance = await getFirestore().collection("attendance").add({
        user: `users/${studentId}`,
        created_at: new Date(),
        type,
    });

    return attendance.id;
};

export const fetchLatestAttendance = async (studentId: string) => {
    // get the latest attendance that happened within the current day

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
    );

    const attendance = await getFirestore().collection("attendance")
        .where("user", "==", `users/${studentId}`)
        .where("created_at", ">=", startOfDay)
        .where("created_at", "<", endOfDay)
        .orderBy("created_at", "desc")
        .limit(1)
        .get();

    return attendance.docs[0]?.data();
};

export const getCompletedSessionsByUser = async (studentId: string, startMonth?: string, endMonth?: string): Promise<number> => {
    const db = getFirestore();
    const now = new Date();

    // Step 1: Calculate default range for the current month
    let startDate: Date;
    let endDate: Date;

    if (startMonth && endMonth) {
        // Parse provided range into Date objects
        startDate = new Date(startMonth);
        endDate = new Date(endMonth);
        // Adjust `endDate` to the last millisecond of the day
        endDate.setHours(23, 59, 59, 999);
    } else {
        // Default to the current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1); // First day of the current month
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the current month
        endDate.setHours(23, 59, 59, 999); // Ensure endDate includes the full day
    }

    // Step 2: Query Firestore for the specified date range
    const sessionQuery = await db
        .collection("attendance") // Replace with your collection name
        .where("user", "==", `users/${studentId}`)
        .where("created_at", ">=", startDate)
        .where("created_at", "<=", endDate)
        .get();

    const records: SessionRecord[] = [];

    sessionQuery.forEach((doc) => {
        const data = doc.data();
        records.push({
            created_at: data.created_at.toDate(),
            type: data.type,
            user: data.user,
        });
    });

    // Step 3: Group records by user
    const userSessions: Record<
        string,
        { in: Date[]; out: Date[] }
    > = {};

    records.forEach((record) => {
        const { user, type, created_at } = record;

        if (!userSessions[user]) {
            userSessions[user] = { in: [], out: [] };
        }

        // Group records into "in" and "out"
        if (type === "in") {
            userSessions[user].in.push(created_at);
        } else if (type === "out") {
            userSessions[user].out.push(created_at);
        }
    });

    // Step 4: Calculate completed sessions
    let completedSessions = 0;

    Object.values(userSessions).forEach(({ in: ins, out: outs }) => {
        // Sort both "in" and "out" arrays by timestamp
        ins.sort((a, b) => a.getTime() - b.getTime());
        outs.sort((a, b) => a.getTime() - b.getTime());

        let i = 0,
            j = 0;

        // Match each "in" with the closest "out" after it
        while (i < ins.length && j < outs.length) {
            if (outs[j] > ins[i]) {
                completedSessions++;
                i++;
                j++;
            } else {
                j++;
            }
        }
    });

    return completedSessions;
}

export const getUserConsecutiveWeeks = async (studentId: string): Promise<number> => {
    const db = getFirestore();
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const sessionQuery = await db
        .collection("attendance")
        .where("user", "==", `users/${studentId}`)
        .where("created_at", ">=", startDate)
        .where("created_at", "<", endDate)
        .get();

    const records: SessionRecord[] = [];

    sessionQuery.forEach((doc) => {
        const data = doc.data();
        records.push({
            created_at: data.created_at.toDate(),
            type: data.type,
            user: data.user,
        });
    });

    // Step 3: Group records by user
    const userSessions: Record<
        string,
        { in: Date[]; out: Date[] }
    > = {};

    records.forEach((record) => {
        const { user, type, created_at } = record;

        if (!userSessions[user]) {
            userSessions[user] = { in: [], out: [] };
        }

        // Group records into "in" and "out"
        if (type === "in") {
            userSessions[user].in.push(created_at);
        } else if (type === "out") {
            userSessions[user].out.push(created_at);
        }
    });

    // Step 4: Calculate completed sessions
    let completedSessions = 0;

    Object.values(userSessions).forEach(({ in: ins, out: outs }) => {
        // Sort both "in" and "out" arrays by timestamp
        ins.sort((a, b) => a.getTime() - b.getTime());
        outs.sort((a, b) => a.getTime() - b.getTime());

        let i = 0,
            j = 0;

        // Match each "in" with the closest "out" after it
        while (i < ins.length && j < outs.length) {
            if (outs[j] > ins[i]) {
                completedSessions++;
                i++;
                j++;
            } else {
                j++;
            }
        }
    });

    return completedSessions;
}