import { Text, View } from "react-native";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import storage from '@react-native-firebase/storage';

export default function TrainerReports() {
    const [date, setDate] = useState(new Date());
    const [reports, setReports] = useState<string[]>([]); // State to hold the report file names

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

                // Extract file names
                const fileNames = result.items.map(item => item.name);
                setReports(fileNames); // Update state with file names
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };

        fetchReports();
    }, []);

    return (
        <View style={{ padding: 20 }}>
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

            <View style={{
                borderBottomWidth: 1,
                borderColor: 'lightgray',
                marginVertical: 10
            }}></View>

            <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 10 }}>Todos los reportes</Text>

            {/* Render the list of reports */}
            {reports.length > 0 ? (
                reports.map((report, index) => (
                    <Text key={index} style={{ marginVertical: 5 }}>
                        {report}
                    </Text>
                ))
            ) : (
                <Text>No hay reportes disponibles</Text>
            )}
        </View>
    );
}
