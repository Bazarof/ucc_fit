import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Modal,
    StyleSheet,
    Pressable,
    Alert,
} from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import * as Print from "expo-print";
import Pdf from "react-native-pdf";

export default function TrainerReports() {
    const [date, setDate] = useState(new Date());
    const [reports, setReports] = useState<string[]>([]);
    const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null); // Track selected PDF URL
    const [modalVisible, setModalVisible] = useState(false); // Track modal visibility

    const openPicker = () => {
        DateTimePickerAndroid.open({
            value: date,
            mode: "date",
            onChange: (event, selectedDate) => {
                if (event.type === "set" && selectedDate) {
                    setDate(selectedDate);
                }
            },
        });
    };

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const reportsRef = storage().ref("reports/");
                const result = await reportsRef.listAll();
                const fileNames = result.items.map((item) => item.name);
                setReports(fileNames);
            } catch (error) {
                console.error("Error fetching reports:", error);
            }
        };

        fetchReports();
    }, []);

    // Function to generate the report and convert it to PDF
    // Function to generate the report and convert it to PDF
    const generateReport = async () => {
        try {
            const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Start of the selected date
            const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // End of the selected date

            // Fetch attendance data from Firestore
            const snapshot = await firestore()
                .collection("attendance")
                .where("created_at", ">=", startOfDay) // Filter for selected date (start of day)
                .where("created_at", "<=", endOfDay) // Filter for selected date (end of day)
                .get();

            const attendanceData = snapshot.docs.map((doc) => doc.data());
            console.log(attendanceData);

            // Create a map to store entries by user ID
            const usersMap = new Map();

            // Iterate over the attendance data to organize entries and exits
            attendanceData.forEach((entry) => {
                const userId = entry.user.split("/")[1]; // Extract the user ID from the user reference
                const userTime = entry.created_at.toDate().toISOString();

                // If the user doesn't exist in the map, create a new entry
                if (!usersMap.has(userId)) {
                    usersMap.set(userId, { name: userId, entryTime: null, exitTime: null });
                }

                const user = usersMap.get(userId);
                console.log("usertime", userTime);

                if (entry.type === "in" && !user.entryTime) {
                    // If it's an "in" type and entryTime is not set, set the entry time
                    user.entryTime = userTime;
                } else if (entry.type === "out" && !user.exitTime) {
                    // If it's an "out" type and exitTime is not set, set the exit time
                    user.exitTime = userTime;
                }
            });

            // Fetch user names and calculate stay durations
            const userNames = new Map();
            const userPromises: any[] = [];

            usersMap.forEach((user, userId) => {
                const userRef = firestore().doc(`users/${userId}`);
                userPromises.push(
                    userRef.get().then((userDoc) => {
                        if (userDoc.exists) {
                            const userData = userDoc.data();
                            userNames.set(userId, userData?.displayName || "Usuario");
                        }
                    })
                );
            });

            console.log(usersMap);

            await Promise.all(userPromises);

            // Helper function to convert Firestore timestamp to local time
            const convertToLocalTime = (timestamp: string) => {
                const date = new Date(timestamp); // Parse the Firestore ISO timestamp
                const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // Adjust to local time
                return localDate;
            };

            // Helper function to calculate the duration between entry and exit times
            const calculateStayDuration = (entryTimestamp: string, exitTimestamp: string): number => {
                const entryDate = convertToLocalTime(entryTimestamp); // Convert to local time
                const exitDate = convertToLocalTime(exitTimestamp); // Convert to local time

                const durationMs = exitDate.getTime() - entryDate.getTime();
                if (durationMs < 0) {
                    return 0; // If exit is earlier than entry, return 0
                }
                return durationMs / 3600000; // Convert milliseconds to hours
            };

            // Build the HTML content for the table
            const tableRows: string[] = [];
            let rowNumber = 1;

            usersMap.forEach((user, userId) => {
                const name = userNames.get(userId);
                const stayDuration = user.entryTime && user.exitTime
                    ? calculateStayDuration(user.entryTime, user.exitTime)
                    : 0;

                tableRows.push(`
                    <tr>
                        <td>${rowNumber++}</td>
                        <td>${name}</td>
                        <td>${user.entryTime ? new Date(user.entryTime).toLocaleTimeString() : "N/A"}</td>
                        <td>${user.exitTime ? new Date(user.exitTime).toLocaleTimeString() : "N/A"}</td>
                        <td>${stayDuration.toFixed(2)} hrs</td>
                    </tr>
                `);
            });

            const htmlContent = `
                <html>
                    <body>
                        <h2>Reporte de Asistencia - ${date.toLocaleDateString("es-MX")}</h2>
                        <table border="1" cellspacing="0" cellpadding="5" style="width:100%; text-align: center;">
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Nombre</th>
                                    <th>Entrada</th>
                                    <th>Salida</th>
                                    <th>Estancia</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows.join("")}
                            </tbody>
                        </table>
                    </body>
                </html>
            `;

            // Generate PDF from HTML
            const { uri } = await Print.printToFileAsync({ html: htmlContent });

            // Upload the generated PDF to Firebase Storage

            const reportRef = storage().ref(`reports/Asistencia_${date.toLocaleDateString('es-MX').replaceAll('/', '_')}.pdf`);
            await reportRef.putFile(uri);

            // Get the URL of the uploaded PDF
            const pdfUrl = await reportRef.getDownloadURL();
            setSelectedPdfUrl(pdfUrl); // Set the URL for the PDF viewer
            setModalVisible(true); // Show the modal
        } catch (error) {
            console.error("Error generating report:", error);
            Alert.alert("Error", "Failed to generate the report.");
        }
    };



    return (
        <View style={{ padding: 20, flex: 1 }}>
            {/* Header with Date Picker */}
            <View
                style={{
                    flexDirection: "row",
                    marginVertical: 10,
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Text>Fecha</Text>
                <TouchableOpacity
                    onPress={openPicker}
                    style={{
                        padding: 10,
                        borderWidth: 1,
                        borderRadius: 5,
                    }}
                >
                    <Text>{date.toLocaleDateString("es-MX")}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={generateReport} // Trigger report generation
                    style={{
                        backgroundColor: "#007FAF",
                        padding: 10,
                        borderRadius: 10,
                        flex: 1,
                    }}
                >
                    <Text style={{ color: "white" }}>Generar reporte</Text>
                </TouchableOpacity>
            </View>

            {/* Separator */}
            <View
                style={{
                    borderBottomWidth: 1,
                    borderColor: "lightgray",
                    marginVertical: 10,
                }}
            ></View>

            {/* Title */}
            <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 10 }}>
                Todos los reportes
            </Text>

            {/* List of Reports */}
            <FlatList
                data={reports}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedPdfUrl(`reports/${item}`);
                            setModalVisible(true);
                        }} // Fetch and display the selected PDF URL
                        style={{
                            padding: 10,
                            borderBottomWidth: 1,
                            borderColor: "lightgray",
                            marginVertical: 5,
                        }}
                    >
                        <Text style={{ fontSize: 16 }}>{item}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text>No hay reportes disponibles</Text>}
            />

            {/* PDF Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Visualizando Reporte</Text>
                        <Pressable
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Cerrar</Text>
                        </Pressable>
                        {selectedPdfUrl && (
                            <Pdf
                                trustAllCerts={false}
                                source={{ uri: selectedPdfUrl }}
                                style={styles.pdfViewer}
                                onLoadComplete={(numberOfPages) =>
                                    console.log(`Total pages: ${numberOfPages}`)
                                }
                                onPageChanged={(page, numberOfPages) =>
                                    console.log(`Current page: ${page}`)
                                }
                                onError={(error) =>
                                    console.error("PDF Error:", error)
                                }
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)", // Backdrop
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "90%",
        height: "80%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    closeButton: {
        alignSelf: "flex-end",
        padding: 10,
        backgroundColor: "#f44336",
        borderRadius: 5,
    },
    closeButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    pdfViewer: {
        flex: 1,
        marginTop: 10,
    },
});
