import storage, { getStorage, ref, uploadBytes, getDownloadURL } from "@react-native-firebase/storage";
import { addDoc, collection, doc, getFirestore, setDoc, updateDoc } from "@react-native-firebase/firestore";
import { getApp } from "@react-native-firebase/app";
// import { db } from "@/firebase"; // Update with your Firebase configuration path


// console.log(getStorage())
// console.log(getApp().storage)

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param fileUri - The URI of the file to upload (from Expo ImagePicker or FileSystem)
 * @param folderName - The folder in Firebase Storage where the file will be stored
 * @returns The download URL of the uploaded file
 */
export const uploadFileToFirebase = async (fileUri: string, folderName: string = "uploads") => {
    try {
        // Generate a unique file name with a timestamp
        const fileName = `${folderName}/${Date.now()}`;

        // Upload the file to Firebase Storage
        const reference = storage().ref(fileName);
        const task = reference.putFile(fileUri);

        // Wait for the upload to complete
        await task;

        // Get the download URL
        const downloadUrl = await reference.getDownloadURL();

        console.log("File uploaded successfully:", downloadUrl);
        return downloadUrl;
    } catch (error) {
        console.error("Error uploading file to Firebase:", error);
        throw new Error("File upload failed.");
    }
};

/**
 * Saves or updates a Firestore document with the file URL.
 * If docId is provided, it updates the document. If docId is not provided, it creates a new document.
 * @param collectionName - The Firestore collection name
 * @param docId - The ID of the document to update (optional)
 * @param fieldName - The field name where the URL should be saved
 * @param fileUrl - The URL of the uploaded file
 */
export const saveFileUrlToFirestore = async (
    collectionName: string,
    docId: string | null,
    fieldName: string,
    fileUrl: string
) => {
    try {

        if (!docId) return

        // Update the existing document
        const docRef = doc(getFirestore(), collectionName, docId);
        await updateDoc(docRef, {
            [fieldName]: fileUrl,
        });
        console.log(`File URL updated in Firestore: ${collectionName}/${docId}`);
    } catch (error) {
        console.error("Error saving file URL to Firestore:", error);
        throw new Error("Failed to save file URL to Firestore.");
    }
};
