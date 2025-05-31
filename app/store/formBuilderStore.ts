import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FieldType = 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'date' | 'email' | 'phone';

export interface FormField {
    id: string;
    type: FieldType;
    label: string;
    placeholder?: string;
    required: boolean;
    helpText?: string;
    options?: string[];
    validation?: {
        minLength?: number;
        maxLength?: number;
        pattern?: string;
    };
}

export interface FormStep {
    id: string;
    title: string;
    fields: FormField[];
}

interface FormBuilderState {
    steps: FormStep[];
    currentStep: number;
    formId: string | null;
    formTitle: string;
    isDarkMode: boolean;
    actions: {
        addField: (stepId: string, field: Omit<FormField, 'id'>) => void;
        updateField: (stepId: string, fieldId: string, updates: Partial<FormField>) => void;
        removeField: (stepId: string, fieldId: string) => void;
        reorderFields: (stepId: string, startIndex: number, endIndex: number) => void;
        addStep: (title: string) => void;
        removeStep: (stepId: string) => void;
        setCurrentStep: (step: number) => void;
        setFormId: (id: string) => void;
        setFormTitle: (title: string) => void;
        toggleDarkMode: () => void;
        resetForm: () => void;
    };
}

const initialState = {
    steps: [
        {
            id: 'step-1',
            title: 'Step 1',
            fields: [],
        },
    ],
    currentStep: 0,
    formId: null,
    formTitle: 'Untitled Form',
    isDarkMode: false,
};

export const useFormBuilderStore = create<FormBuilderState>()(
    persist(
        (set, get) => ({
            ...initialState,
            actions: {
                addField: (stepId, field) => {
                    set((state) => ({
                        steps: state.steps.map((step) =>
                            step.id === stepId
                                ? {
                                    ...step,
                                    fields: [
                                        ...step.fields,
                                        { ...field, id: `field-${Date.now()}` },
                                    ],
                                }
                                : step
                        ),
                    }));
                },
                updateField: (stepId, fieldId, updates) => {
                    set((state) => ({
                        steps: state.steps.map((step) =>
                            step.id === stepId
                                ? {
                                    ...step,
                                    fields: step.fields.map((field) =>
                                        field.id === fieldId ? { ...field, ...updates } : field
                                    ),
                                }
                                : step
                        ),
                    }));
                },
                removeField: (stepId, fieldId) => {
                    set((state) => ({
                        steps: state.steps.map((step) =>
                            step.id === stepId
                                ? {
                                    ...step,
                                    fields: step.fields.filter((field) => field.id !== fieldId),
                                }
                                : step
                        ),
                    }));
                },
                reorderFields: (stepId, startIndex, endIndex) => {
                    set((state) => {
                        const step = state.steps.find((s) => s.id === stepId);
                        if (!step) return state;

                        const newFields = Array.from(step.fields);
                        const [removed] = newFields.splice(startIndex, 1);
                        newFields.splice(endIndex, 0, removed);

                        return {
                            steps: state.steps.map((s) =>
                                s.id === stepId ? { ...s, fields: newFields } : s
                            ),
                        };
                    });
                },
                addStep: (title) => {
                    set((state) => ({
                        steps: [
                            ...state.steps,
                            {
                                id: `step-${Date.now()}`,
                                title,
                                fields: [],
                            },
                        ],
                    }));
                },
                removeStep: (stepId) => {
                    set((state) => ({
                        steps: state.steps.filter((step) => step.id !== stepId),
                        currentStep: Math.min(state.currentStep, state.steps.length - 2),
                    }));
                },
                setCurrentStep: (step) => {
                    set({ currentStep: step });
                },
                setFormId: (id) => {
                    set({ formId: id });
                },
                setFormTitle: (title) => {
                    set({ formTitle: title });
                },
                toggleDarkMode: () => {
                    set((state) => ({ isDarkMode: !state.isDarkMode }));
                },
                resetForm: () => {
                    set(initialState);
                },
            },
        }),
        {
            name: 'form-builder-storage',
        }
    )
); 