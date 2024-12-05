import React from "react";
import Form, { FormField } from "@/components/Form";

const CreateProfileScreen = () => {
    const fields: FormField[] = [
        { name: "name", label: "Name", type: "text", validation: { required: true, minLength: 3 } },
        { name: "description", label: "Description", type: "textarea" },
        { name: "profilePicture", label: "Profile Picture", type: "file", validation: { required: true } },
    ];

    const handleSubmit = async (formData: any) => {
        // Save other form data to Firestore
        console.log("Submitted Data:", formData);
    };

    return (
        <Form
            title="Create Profile"
            fields={fields}
            collectionName="profiles"
            documentId="newDocId123"
            onSubmit={handleSubmit}
        />
    );
};

export default CreateProfileScreen;
