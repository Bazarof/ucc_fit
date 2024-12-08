import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadFileToFirebase, saveFileUrlToFirestore } from "@/services/fileService";
import { useRouter } from "expo-router";

export interface Field {
    name: string;
    label: string;
    type: string;
    validation?: { required?: boolean; minLength?: number; maxLength?: number };
}

interface FormProps {
    title: string;
    fields: Field[];
    collectionName: string;
    docId?: string; // Optional for creating a new document
    onSubmit: (formData: any, docId: string | null) => void;
}

const Form: React.FC<FormProps> = ({ title, fields, collectionName, docId = null, onSubmit }) => {
    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const router = useRouter();

    const handleInputChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleFileUpload = async (name: string) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            selectionLimit: 1,
        });

        if (!result.canceled) {
            setLoading(true); // Start loader
            const fileUri = result.assets[0].uri;

            try {
                const downloadUrl = await uploadFileToFirebase(fileUri, "uploads");
                setFormData({ ...formData, [name]: downloadUrl });
                setImagePreview(downloadUrl); // Set preview
                await saveFileUrlToFirestore(collectionName, docId, name, downloadUrl);
                Alert.alert("Success", "File uploaded successfully!");
            } catch (error) {
                Alert.alert("Error", "Failed to upload file.");
            } finally {
                setLoading(false); // Stop loader
            }
        }
    };

    const validate = () => {
        let valid = true;
        let newErrors: any = {};

        fields.forEach((field) => {
            const value = formData[field.name];
            if (field.validation?.required && !value) {
                newErrors[field.name] = "This field is required.";
                valid = false;
            } else if (field.validation?.minLength && value.length < field.validation.minLength) {
                newErrors[field.name] = `Minimum length is ${field.validation.minLength}.`;
                valid = false;
            } else if (field.validation?.maxLength && value.length > field.validation.maxLength) {
                newErrors[field.name] = `Maximum length is ${field.validation.maxLength}.`;
                valid = false;
            }
        });

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async () => {
        if (validate()) {
            try {
                await onSubmit(formData, docId);
                Alert.alert("Success", "Form submitted successfully!");
                router.back();
            } catch (error) {
                Alert.alert("Error", "Failed to submit form.");
            }
        } else {
            Alert.alert("Validation Error", "Please fix the errors in the form.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {fields.map((field) => (
                <View key={field.name} style={styles.inputContainer}>
                    <Text>{field.label}</Text>
                    {field.type === "file" ? (
                        <>
                            <TouchableOpacity
                                onPress={() => handleFileUpload(field.name)}
                                style={styles.fileInput}
                            >
                                <Text>{loading ? "Cargando..." : "Cargar"}</Text>
                            </TouchableOpacity>
                            {loading && <ActivityIndicator size="small" color="#007FAF" />}
                            {imagePreview && <Image source={{ uri: imagePreview }} style={styles.imagePreview} />}
                        </>
                    ) : (
                        <TextInput
                            style={styles.textInput}
                            onChangeText={(value) => handleInputChange(field.name, value)}
                            value={formData[field.name] || ""}
                            placeholder={field.label}
                            secureTextEntry={field.type === "password"}
                        />
                    )}
                    {errors[field.name] && <Text style={styles.errorText}>{errors[field.name]}</Text>}
                </View>
            ))}
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
    },
    inputContainer: {
        marginBottom: 10,
    },
    textInput: {
        borderWidth: 1,
        borderColor: "gray",
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
    },
    fileInput: {
        padding: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
        textAlign: "center",
        marginTop: 5,
    },
    button: {
        backgroundColor: "#007FAF",
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
    },
    errorText: {
        color: "red",
        marginTop: 5,
    },
    imagePreview: {
        width: 100,
        height: 100,
        marginTop: 10,
        borderRadius: 5,
    },
});

export default Form;
