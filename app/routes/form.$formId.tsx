import { useLoaderData, useSubmit } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useFormBuilderStore, FormField } from "~/store/formBuilderStore";
import FormPreview from "~/components/FormPreview";

interface FormStep {
    id: string;
    title: string;
    fields: FormField[];
}

interface FormData {
    formTitle: string;
    steps: FormStep[];
    currentStep: number;
}

interface LoaderData {
    form: FormData;
}

export async function loader({ params }: LoaderFunctionArgs) {
    // In a real application, you would fetch the form data from your backend
    // For now, we'll use the data from localStorage (simulate server-side)
    // Note: localStorage is not available on the server, so this is just a placeholder.
    // You should replace this with actual backend fetching logic.
    // For now, we'll return a mock form for demonstration.
    const form: FormData = {
        formTitle: "Sample Form",
        steps: [
            {
                id: "step1",
                title: "Step 1",
                fields: [],
            },
        ],
        currentStep: 0,
    };

    return json<LoaderData>({ form });
}

// UI Component
export default function FormRoute() {
    const { form } = useLoaderData<LoaderData>();

    function handleSubmit(data: any): void {
        // You can handle form submission here.
        // For now, just log the submitted data.
        console.log("Form submitted with data:", data);
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            {form.steps.map((step: FormStep, index: number) => (
                <div key={step.id} className={index === form.currentStep ? "" : "hidden"}>
                    <h2 className="text-xl font-semibold mb-6">{step.title}</h2>
                    <FormPreview
                        fields={step.fields}
                        onSubmit={handleSubmit}
                        mode="desktop"
                    />
                </div>
            ))}

            {form.steps.length > 1 && (
                <div className="mt-8 flex justify-between">
                    <button
                        onClick={() => {
                            if (form.currentStep > 0) {
                                // Handle previous step
                            }
                        }}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${form.currentStep === 0
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-primary-600 hover:text-primary-700"
                            }`}
                        disabled={form.currentStep === 0}
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => {
                            if (form.currentStep < form.steps.length - 1) {
                                // Handle next step
                            }
                        }}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${form.currentStep === form.steps.length - 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-primary-600 hover:text-primary-700"
                            }`}
                        disabled={form.currentStep === form.steps.length - 1}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
