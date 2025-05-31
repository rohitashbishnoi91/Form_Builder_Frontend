import type { MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useFormBuilderStore } from "~/store/formBuilderStore";
import { FormField, FieldType } from "~/store/formBuilderStore";
import { PlusIcon, SunIcon, MoonIcon, DevicePhoneMobileIcon, DeviceTabletIcon, ComputerDesktopIcon, ShareIcon } from "@heroicons/react/24/outline";
import FieldConfig from "~/components/FieldConfig";
import FormPreview from "~/components/FormPreview";
import StepManager from "~/components/StepManager";
import TemplateManager from "~/components/TemplateManager";
import SortableField from "~/components/SortableField";

const FIELD_TYPES: { type: FieldType; label: string; icon: string }[] = [
  { type: "text", label: "Text Input", icon: "T" },
  { type: "textarea", label: "Text Area", icon: "¶" },
  { type: "dropdown", label: "Dropdown", icon: "▼" },
  { type: "checkbox", label: "Checkbox", icon: "☑" },
  { type: "date", label: "Date", icon: "📅" },
  { type: "email", label: "Email", icon: "✉" },
  { type: "phone", label: "Phone", icon: "📱" },
];

type PreviewMode = "desktop" | "tablet" | "mobile";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function FormBuilder() {
  const steps = useFormBuilderStore((state) => state.steps);
const currentStep = useFormBuilderStore((state) => state.currentStep);
const formTitle = useFormBuilderStore((state) => state.formTitle);
const isDarkMode = useFormBuilderStore((state) => state.isDarkMode);
const actions = useFormBuilderStore((state) => state.actions);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isAddingField, setIsAddingField] = useState(false);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [showShareModal, setShowShareModal] = useState(false);
  const formId = useFormBuilderStore.getState().formId;
const key = formId ? `form-responses-${formId}` : "form-responses";
const [responses, setResponses] = useState<any[]>([]);

useEffect(() => {
  if (typeof window !== "undefined") {
    const formId = useFormBuilderStore.getState().formId;
    const key = formId ? `form-responses-${formId}` : "form-responses";
    const stored = localStorage.getItem(key);
    setResponses(stored ? JSON.parse(stored) : []);
  }
}, []);
useEffect(() => {
  function handleStorageChange(e: StorageEvent) {
    if (!e.key) return;
    const formId = useFormBuilderStore.getState().formId;
    const key = formId ? `form-responses-${formId}` : "form-responses";
    if (e.key === key) {
      setResponses(e.newValue ? JSON.parse(e.newValue) : []);
    }
  }
  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}, []);

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

    console.log("Drag from", oldIndex, "to", newIndex); // <-- Add this line

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

  const handleFieldUpdate = (fieldId: string, updates: Partial<FormField>) => {
    actions.updateField(currentStepData.id, fieldId, updates);
  };

const handleFormSubmit = (data: any) => {
  console.log("Form submitted with data:", data);
  const formId = useFormBuilderStore.getState().formId;
  const key = formId ? `form-responses-${formId}` : "form-responses";
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  existing.push(data);
  localStorage.setItem(key, JSON.stringify(existing));
  setResponses(existing); // <-- update state
};
const handleShare = () => {
  const formId = `form-${Date.now()}`;
  actions.setFormId(formId);
  setShowShareModal(true);
  // Save immediately after setting formId
  const { formTitle, steps, currentStep } = useFormBuilderStore.getState();
  const formToSave = { formTitle, steps, currentStep };
  localStorage.setItem(formId, JSON.stringify(formToSave));
};

// Gather the form data you want to save
useEffect(() => {
  const formId = useFormBuilderStore.getState().formId;
  if (!formId) return;
  const formToSave = {
    formTitle,
    steps,
    currentStep,
  };
  localStorage.setItem(formId, JSON.stringify(formToSave));
}, [formTitle, steps, currentStep]);

  const getShareableLink = () => {
    const formId = useFormBuilderStore.getState().formId;
    if (!formId) return "";
    return `${window.location.origin}/form/${formId}`;
  };

  return (
    <div className="form-builder-container">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={formTitle}
              onChange={(e) => actions.setFormTitle(e.target.value)}
              className="text-2xl font-bold bg-transparent border-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1"
            />
            <TemplateManager />
            <button
              onClick={handleShare}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ShareIcon className="h-5 w-5 mr-2" />
              Share
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode("desktop")}
                className={`p-2 rounded-md ${previewMode === "desktop"
                  ? "bg-white dark:bg-gray-800 shadow-sm"
                  : "text-gray-500 dark:text-gray-400"
                  }`}
              >
                <ComputerDesktopIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setPreviewMode("tablet")}
                className={`p-2 rounded-md ${previewMode === "tablet"
                  ? "bg-white dark:bg-gray-800 shadow-sm"
                  : "text-gray-500 dark:text-gray-400"
                  }`}
              >
                <DeviceTabletIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`p-2 rounded-md ${previewMode === "mobile"
                  ? "bg-white dark:bg-gray-800 shadow-sm"
                  : "text-gray-500 dark:text-gray-400"
                  }`}
              >
                <DevicePhoneMobileIcon className="h-5 w-5" />
              </button>
            </div>
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Form Builder */}
          <div className="col-span-8">
            <StepManager />
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
  <SortableField
    key={field.id}
    field={field}
    onClick={() => setSelectedField(field)}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <span className="text-lg mr-2">
          {FIELD_TYPES.find((t) => t.type === field.type)?.icon}
        </span>
        <span className="font-medium">{field.label}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          actions.removeField(currentStepData.id, field.id);
        }}
        className="text-gray-400 hover:text-red-500"
      >
        ×
      </button>
    </div>
  </SortableField>
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
              <FormPreview
                fields={currentStepData.fields}
                onSubmit={handleFormSubmit}
                mode={previewMode}
              />
            </div>
          </div>
        </div>

       

      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Share Form</h2>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Share this link with others to let them fill out your form:
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={getShareableLink()}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(getShareableLink());
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Field Configuration Modal */}
      {selectedField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
            <FieldConfig
              field={selectedField}
              onUpdate={(updates) => handleFieldUpdate(selectedField.id, updates)}
              onClose={() => setSelectedField(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
