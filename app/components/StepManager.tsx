import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useFormBuilderStore } from "~/store/formBuilderStore";

export default function StepManager() {
    const { steps, currentStep, actions } = useFormBuilderStore();

    const handleAddStep = () => {
        const newStepTitle = `Step ${steps.length + 1}`;
        actions.addStep(newStepTitle);
    };

    const handleRemoveStep = (stepId: string) => {
        if (steps.length > 1) {
            actions.removeStep(stepId);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Form Steps</h2>
                <button
                    onClick={handleAddStep}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Step
                </button>
            </div>

            {/* Progress Bar */}
            <div className="relative mb-6">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                    <div
                        style={{
                            width: `${((currentStep + 1) / steps.length) * 100}%`,
                        }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500 transition-all duration-500"
                    />
                </div>
            </div>

            {/* Steps List */}
            <div className="space-y-2">
                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${index === currentStep
                                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                                : "border-gray-200 dark:border-gray-700"
                            }`}
                    >
                        <button
                            onClick={() => actions.setCurrentStep(index)}
                            className="flex-1 text-left"
                        >
                            <div className="flex items-center">
                                <span
                                    className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium ${index === currentStep
                                            ? "bg-primary-500 text-white"
                                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                        }`}
                                >
                                    {index + 1}
                                </span>
                                <span className="ml-3 font-medium">{step.title}</span>
                            </div>
                        </button>

                        {steps.length > 1 && (
                            <button
                                onClick={() => handleRemoveStep(step.id)}
                                className="ml-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <TrashIcon className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
} 