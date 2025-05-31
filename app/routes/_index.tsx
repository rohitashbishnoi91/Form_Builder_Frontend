import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useFormBuilderStore } from "~/store/formBuilderStore";
import { FormField, FieldType } from "~/store/formBuilderStore";
import { PlusIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";

const FIELD_TYPES: { type: FieldType; label: string; icon: string }[] = [
  { type: "text", label: "Text Input", icon: "T" },
  { type: "textarea", label: "Text Area", icon: "¶" },
  { type: "dropdown", label: "Dropdown", icon: "▼" },
  { type: "checkbox", label: "Checkbox", icon: "☑" },
  { type: "date", label: "Date", icon: "📅" },
  { type: "email", label: "Email", icon: "✉" },
  { type: "phone", label: "Phone", icon: "📱" },
];

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function FormBuilder() {
  const { steps, currentStep, formTitle, isDarkMode, actions } = useFormBuilderStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isAddingField, setIsAddingField] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const currentStepData = steps[currentStep];

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = currentStepData.fields.findIndex((field) => field.id === active.id);
      const newIndex = currentStepData.fields.findIndex((field) => field.id === over.id);

      actions.reorderFields(currentStepData.id, oldIndex, newIndex);
    }

    setActiveId(null);
  };

  const handleAddField = (type: FieldType) => {
    actions.addField(currentStepData.id, {
      type,
      label: `New ${type} field`,
      required: false,
    });
    setIsAddingField(false);
  };

  return (
    <div className="form-builder-container">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <input
            type="text"
            value={formTitle}
            onChange={(e) => actions.setFormTitle(e.target.value)}
            className="text-2xl font-bold bg-transparent border-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1"
          />
          <button
            onClick={() => actions.toggleDarkMode()}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isDarkMode ? (
              <SunIcon className="h-6 w-6" />
            ) : (
              <MoonIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Form Builder */}
          <div className="col-span-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Form Builder</h2>
                <button
                  onClick={() => setIsAddingField(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Field
                </button>
              </div>

              {isAddingField && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Select Field Type</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {FIELD_TYPES.map((field) => (
                      <button
                        key={field.type}
                        onClick={() => handleAddField(field.type)}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <div className="text-2xl mb-2">{field.icon}</div>
                        <div className="text-sm font-medium">{field.label}</div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setIsAddingField(false)}
                    className="mt-4 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={currentStepData.fields.map((field) => field.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {currentStepData.fields.map((field) => (
                      <div
                        key={field.id}
                        className="form-field cursor-move"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">
                              {FIELD_TYPES.find((t) => t.type === field.type)?.icon}
                            </span>
                            <span className="font-medium">{field.label}</span>
                          </div>
                          <button
                            onClick={() => actions.removeField(currentStepData.id, field.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay>
                  {activeId ? (
                    <div className="form-field opacity-50">
                      {currentStepData.fields.find((field) => field.id === activeId)?.label}
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="col-span-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Preview</h2>
              <div className="form-preview">
                {currentStepData.fields.map((field) => (
                  <div key={field.id} className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderPreviewField(field)}
                    {field.helpText && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {field.helpText}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function renderPreviewField(field: FormField) {
  switch (field.type) {
    case "text":
    case "email":
    case "phone":
      return (
        <input
          type={field.type}
          placeholder={field.placeholder}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
        />
      );
    case "textarea":
      return (
        <textarea
          placeholder={field.placeholder}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
          rows={3}
        />
      );
    case "dropdown":
      return (
        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700">
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
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
      );
    case "date":
      return (
        <input
          type="date"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
        />
      );
    default:
      return null;
  }
}
