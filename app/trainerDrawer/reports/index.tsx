import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, FlatList } from "react-native";
import storage from '@react-native-firebase/storage';
import Pdf from 'react-native-pdf'; // Import react-native-pdf
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

export default function TrainerReports() {
    const [date, setDate] = useState(new Date());
    const [reports, setReports] = useState<string[]>([]);
    const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null); // Track selected PDF URL

    const openPicker = () => {
        DateTimePickerAndroid.open({
            value: date,
            mode: 'date',
            onChange: (event, selectedDate) => {
                if (event.type === 'set' && selectedDate) {
                    setDate(selectedDate);
                }
            }
        });
    };

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const reportsRef = storage().ref('reports/');
                const result = await reportsRef.listAll();
                const fileNames = result.items.map(item => item.name);
                setReports(fileNames);
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };

        fetchReports();
    }, []);

    // Function to get the download URL of a selected PDF file
    const fetchPdfUrl = async (fileName: string) => {
        try {
            const url = await storage().ref(`reports/${fileName}`).getDownloadURL();
            setSelectedPdfUrl(url); // Set the URL for the PDF viewer
        } catch (error) {
            console.error('Error fetching PDF URL:', error);
        }
    };

    return (
        <View style={{ padding: 20, flex: 1 }}>
            {/* Header with Date Picker */}
            <View style={{
                flexDirection: "row",
                marginVertical: 10,
                alignItems: 'center',
                justifyContent: "space-between"
            }}>
                <Text>Fecha</Text>
                <TouchableOpacity onPress={openPicker} style={{
                    padding: 10,
                    borderWidth: 1,
                    borderRadius: 5
                }}>
                    <Text>{date.toLocaleDateString('es-MX')}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={openPicker} style={{
                    backgroundColor: '#007FAF',
                    padding: 10,
                    borderRadius: 10,
                    flex: 1
                }}>
                    <Text style={{ color: 'white' }}>Generar reporte</Text>
                </TouchableOpacity>
            </View>

            {/* Separator */}
            <View style={{
                borderBottomWidth: 1,
                borderColor: 'lightgray',
                marginVertical: 10
            }}></View>

            {/* Title */}
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 10 }}>Todos los reportes</Text>

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
                            borderColor: 'lightgray',
                            marginVertical: 5
                        }}
                    >
                        <Text style={{ fontSize: 16 }}>{item}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text>No hay reportes disponibles</Text>}
            />

            {/* PDF Viewer */}
            {selectedPdfUrl && (
                <View style={{ flex: 1, marginTop: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
                        Visualizando: {selectedPdfUrl.split('/').pop()}
                    </Text>
                    <Pdf
                        source={{ uri: selectedPdfUrl }}
                        style={{ flex: 1 }}
                        onLoadComplete={(numberOfPages) =>
                            console.log(`Total pages: ${numberOfPages}`)
                        }
                        onPageChanged={(page, numberOfPages) =>
                            console.log(`Current page: ${page}`)
                        }
                        onError={(error) =>
                            console.error('PDF Error:', error)
                        }
                    />
                </View>
            )}
        </View>
    );
}
