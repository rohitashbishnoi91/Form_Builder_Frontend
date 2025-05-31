import { useEffect, useState } from "react";
import { useFormBuilderStore } from "~/store/formBuilderStore";
import { PlusIcon, DocumentDuplicateIcon, TrashIcon } from "@heroicons/react/24/outline";

const PREDEFINED_TEMPLATES = [
    {
        id: "contact",
        title: "Contact Form",
        steps: [
            {
                id: "step-1",
                title: "Contact Information",
                fields: [
                    {
                        id: "name",
                        type: "text",
                        label: "Full Name",
                        required: true,
                        placeholder: "Enter your full name",
                    },
                    {
                        id: "email",
                        type: "email",
                        label: "Email Address",
                        required: true,
                        placeholder: "Enter your email address",
                    },
                    {
                        id: "phone",
                        type: "phone",
                        label: "Phone Number",
                        required: false,
                        placeholder: "Enter your phone number",
                    },
                    {
                        id: "message",
                        type: "textarea",
                        label: "Message",
                        required: true,
                        placeholder: "Enter your message",
                        validation: {
                            minLength: 10,
                            maxLength: 500,
                        },
                    },
                ],
            },
        ],
    },
    {
        id: "registration",
        title: "Registration Form",
        steps: [
            {
                id: "step-1",
                title: "Personal Information",
                fields: [
                    {
                        id: "firstName",
                        type: "text",
                        label: "First Name",
                        required: true,
                        placeholder: "Enter your first name",
                    },
                    {
                        id: "lastName",
                        type: "text",
                        label: "Last Name",
                        required: true,
                        placeholder: "Enter your last name",
                    },
                    {
                        id: "dob",
                        type: "date",
                        label: "Date of Birth",
                        required: true,
                    },
                    {
                        id: "gender",
                        type: "dropdown",
                        label: "Gender",
                        required: true,
                        options: ["Male", "Female", "Other", "Prefer not to say"],
                    },
                ],
            },
            {
                id: "step-2",
                title: "Account Information",
                fields: [
                    {
                        id: "email",
                        type: "email",
                        label: "Email Address",
                        required: true,
                        placeholder: "Enter your email address",
                    },
                    {
                        id: "password",
                        type: "text",
                        label: "Password",
                        required: true,
                        placeholder: "Enter your password",
                        validation: {
                            minLength: 8,
                        },
                    },
                    {
                        id: "terms",
                        type: "checkbox",
                        label: "I agree to the terms and conditions",
                        required: true,
                    },
                ],
            },
        ],
    },
];

export default function TemplateManager() {
    const { actions } = useFormBuilderStore();
    const [isOpen, setIsOpen] = useState(false);
   const [savedTemplates, setSavedTemplates] = useState<any[]>([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const templates = localStorage.getItem("form-templates");
            if (templates) setSavedTemplates(JSON.parse(templates));
        }
    }, []);

    const handleLoadTemplate = (template: any) => {
        actions.resetForm();
        actions.setFormTitle(template.title);
        template.steps.forEach((step: any) => {
            if (step.id !== "step-1") {
                actions.addStep(step.title);
            }
            step.fields.forEach((field: any) => {
                actions.addField(step.id, field);
            });
        });
        setIsOpen(false);
    };

    const handleSaveTemplate = () => {
        const { steps, formTitle } = useFormBuilderStore.getState();
        const newTemplate = {
            id: `template-${Date.now()}`,
            title: formTitle,
            steps,
        };

        const updatedTemplates = [...savedTemplates, newTemplate];
        setSavedTemplates(updatedTemplates);
        if (typeof window !== "undefined") {
            localStorage.setItem("form-templates", JSON.stringify(updatedTemplates));
        }
        setIsOpen(false);
    };

    const handleDeleteTemplate = (templateId: string) => {
        const updatedTemplates = savedTemplates.filter(
            (template: any) => template.id !== templateId
        );
        setSavedTemplates(updatedTemplates);
        if (typeof window !== "undefined") {
            localStorage.setItem("form-templates", JSON.stringify(updatedTemplates));
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
                <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
                Templates
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold">Form Templates</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Predefined Templates */}
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Predefined Templates</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {PREDEFINED_TEMPLATES.map((template) => (
                                            <button
                                                key={template.id}
                                                onClick={() => handleLoadTemplate(template)}
                                                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-600"
                                            >
                                                <h4 className="font-medium">{template.title}</h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    {template.steps.length} step
                                                    {template.steps.length > 1 ? "s" : ""}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Saved Templates */}
                                {savedTemplates.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-medium mb-4">Your Templates</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {savedTemplates.map((template: any) => (
                                                <div
                                                    key={template.id}
                                                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <button
                                                            onClick={() => handleLoadTemplate(template)}
                                                            className="flex-1 text-left"
                                                        >
                                                            <h4 className="font-medium">{template.title}</h4>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                                {template.steps.length} step
                                                                {template.steps.length > 1 ? "s" : ""}
                                                            </p>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteTemplate(template.id)}
                                                            className="ml-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Save Current Form as Template */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <button
                                        onClick={handleSaveTemplate}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                    >
                                        <PlusIcon className="h-5 w-5 mr-2" />
                                        Save Current Form as Template
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 