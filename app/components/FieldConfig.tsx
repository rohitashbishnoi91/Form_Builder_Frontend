import { useState } from "react";
import { FormField, FieldType } from "~/store/formBuilderStore";

interface FieldConfigProps {
    field: FormField;
    onUpdate: (updates: Partial<FormField>) => void;
    onClose: () => void;
}

export default function FieldConfig({ field, onUpdate, onClose }: FieldConfigProps) {
    const [localField, setLocalField] = useState(field);

    const handleChange = (updates: Partial<FormField>) => {
        const newField = { ...localField, ...updates };
        setLocalField(newField);
        onUpdate(updates);
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...(localField.options || [])];
        newOptions[index] = value;
        handleChange({ options: newOptions });
    };

    const addOption = () => {
        const newOptions = [...(localField.options || []), ""];
        handleChange({ options: newOptions });
    };

    const removeOption = (index: number) => {
        const newOptions = [...(localField.options || [])];
        newOptions.splice(index, 1);
        handleChange({ options: newOptions });
    };

    return (
        <div className="field-config-panel">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Field Configuration</h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                >
                    ×
                </button>
            </div>

            <div className="space-y-4">
                {/* Label */}
                <div>
                    <label className="block text-sm font-medium mb-1">Label</label>
                    <input
                        type="text"
                        value={localField.label}
                        onChange={(e) => handleChange({ label: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                    />
                </div>

                {/* Placeholder */}
                <div>
                    <label className="block text-sm font-medium mb-1">Placeholder</label>
                    <input
                        type="text"
                        value={localField.placeholder || ""}
                        onChange={(e) => handleChange({ placeholder: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                    />
                </div>

                {/* Required */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={localField.required}
                        onChange={(e) => handleChange({ required: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm font-medium">Required</label>
                </div>

                {/* Help Text */}
                <div>
                    <label className="block text-sm font-medium mb-1">Help Text</label>
                    <textarea
                        value={localField.helpText || ""}
                        onChange={(e) => handleChange({ helpText: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                        rows={2}
                    />
                </div>

                {/* Validation */}
                {(field.type === "text" || field.type === "textarea") && (
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium">Validation</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Min Length</label>
                                <input
                                    type="number"
                                    value={localField.validation?.minLength || ""}
                                    onChange={(e) =>
                                        handleChange({
                                            validation: {
                                                ...localField.validation,
                                                minLength: e.target.value ? parseInt(e.target.value) : undefined,
                                            },
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Max Length</label>
                                <input
                                    type="number"
                                    value={localField.validation?.maxLength || ""}
                                    onChange={(e) =>
                                        handleChange({
                                            validation: {
                                                ...localField.validation,
                                                maxLength: e.target.value ? parseInt(e.target.value) : undefined,
                                            },
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Options for Dropdown */}
                {field.type === "dropdown" && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium">Options</label>
                            <button
                                onClick={addOption}
                                className="text-sm text-primary-600 hover:text-primary-700"
                            >
                                + Add Option
                            </button>
                        </div>
                        <div className="space-y-2">
                            {localField.options?.map((option, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                                    />
                                    <button
                                        onClick={() => removeOption(index)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 