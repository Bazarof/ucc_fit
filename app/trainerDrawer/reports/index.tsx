import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Modal,
    StyleSheet,
    Pressable,
} from "react-native";
import storage from "@react-native-firebase/storage";
import Pdf from "react-native-pdf";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

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

    // Function to get the download URL of a selected PDF file
    const fetchPdfUrl = async (fileName: string) => {
        try {
            const url = await storage().ref(`reports/${fileName}`).getDownloadURL();
            setSelectedPdfUrl(url); // Set the URL for the PDF viewer
            setModalVisible(true); // Show the modal
        } catch (error) {
            console.error("Error fetching PDF URL:", error);
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
                    onPress={openPicker}
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
                        onPress={() => fetchPdfUrl(item)} // Fetch and display the PDF URL
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
