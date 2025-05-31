import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "~/store/formBuilderStore";

interface FormPreviewProps {
    fields: FormField[];
    onSubmit: (data: any) => void;
    mode?: "desktop" | "tablet" | "mobile";
}

export default function FormPreview({ fields, onSubmit, mode = "desktop" }: FormPreviewProps) {
    // Generate validation schema based on fields
    const generateValidationSchema = () => {
        const schema: Record<string, any> = {};

        fields.forEach((field) => {
            let fieldSchema: z.ZodTypeAny = z.any();

            switch (field.type) {
                case "text":
                case "textarea":
                    fieldSchema = z.string();
                    if (field.validation?.minLength) {
                        fieldSchema = fieldSchema.min(field.validation.minLength);
                    }
                    if (field.validation?.maxLength) {
                        fieldSchema = fieldSchema.max(field.validation.maxLength);
                    }
                    break;
                case "email":
                    fieldSchema = z.string().email();
                    break;
                case "phone":
                    fieldSchema = z.string().regex(/^\+?[\d\s-]{10,}$/);
                    break;
                case "dropdown":
                    fieldSchema = z.string();
                    if (field.options?.length) {
                        fieldSchema = fieldSchema.refine(
                            (val) => field.options?.includes(val),
                            "Please select a valid option"
                        );
                    }
                    break;
                case "checkbox":
                    fieldSchema = z.boolean();
                    break;
                case "date":
                    fieldSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
                    break;
            }

            if (field.required) {
                fieldSchema = fieldSchema.nonempty("This field is required");
            } else {
                fieldSchema = fieldSchema.optional();
            }

            schema[field.id] = fieldSchema;
        });

        return z.object(schema);
    };

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(generateValidationSchema()),
    });

    const getPreviewWidth = () => {
        switch (mode) {
            case "mobile":
                return "max-w-sm";
            case "tablet":
                return "max-w-md";
            default:
                return "max-w-2xl";
        }
    };

    return (
        <div className={`form-preview ${getPreviewWidth()} mx-auto`}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {fields.map((field) => (
                    <div key={field.id} className="space-y-1">
                        <label className="block text-sm font-medium">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>

                        <Controller
                            name={field.id}
                            control={control}
                            defaultValue=""
                            render={({ field: { onChange, value } }) => (
                                <div>
                                    {renderField(field, onChange, value)}
                                    {errors[field.id] && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors[field.id]?.message as string}
                                        </p>
                                    )}
                                    {field.helpText && (
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            {field.helpText}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                ))}

                <button
                    type="submit"
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-md"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

function renderField(
    field: FormField,
    onChange: (value: any) => void,
    value: any
) {
    switch (field.type) {
        case "text":
        case "email":
        case "phone":
            return (
                <input
                    type={field.type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                />
            );
        case "textarea":
            return (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                />
            );
        case "dropdown":
            return (
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                >
                    <option value="">Select an option</option>
                    {field.options?.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            );
        case "checkbox":
            return (
                <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
            );
        case "date":
            return (
                <input
                    type="date"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                />
            );
        default:
            return null;
    }
} 