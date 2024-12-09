import React from "react";
import Form, { Field } from "@/components/Form";
import { createMeal } from "@/services/mealService";

const CreateMealScreen = () => {
    const fields: Field[] = [
        { name: "name", label: "Nombre", type: "text", validation: { required: true, minLength: 3 } },
        { name: "description", label: "Descripción", type: "textarea" },
        { name: "image_url", label: "Imagen", type: "file", validation: { required: true } },
    ];

    const handleSubmit = async (formData: any) => {
        console.log("Submitted Data:", formData);

        await createMeal(formData);
    };

    return (
        <Form
            title="Create Profile"
            fields={fields}
            collectionName="profiles"
            onSubmit={handleSubmit}
        />
    );
};

export default CreateMealScreen;
