import React from "react";
import Form, { Field } from "@/components/Form";
import { createMealPlan } from "@/services/mealPlanService";

const CreateMealPlanScreen = () => {
    const fields: Field[] = [
        { name: "name", label: "Nombre", type: "text", validation: { required: true, minLength: 3 } },
        { name: "description", label: "Descripción", type: "textarea" },
        { name: "image_url", label: "Imagen", type: "file", validation: { required: true } },
        { name: 'objective', label: 'Objetivo', type: 'select', options: ['Perder peso', 'Ganar peso', 'Ganar masa muscular', 'Mantener peso', 'Mejorar salud'] },
        { name: 'uid', label: 'Usuario', type: 'select', model: 'users', validation: { required: true } },
        { name: 'meals', label: 'Comidas', type: 'meal_select' },
    ];

    const handleSubmit = async (formData: any) => {
        console.log("Submitted Data:", formData);

        await createMealPlan(formData);
    };

    return (
        <Form
            title="Crear plan alimenticio"
            fields={fields}
            collectionName="meal_plans"
            onSubmit={handleSubmit}
        />
    );
};

export default CreateMealPlanScreen;
