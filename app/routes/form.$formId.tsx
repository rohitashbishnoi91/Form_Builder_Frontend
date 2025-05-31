import { useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import FormPreview from "~/components/FormPreview";
import type { FormField } from "~/store/formBuilderStore";

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

export default function FormRoute() {
  const { formId } = useParams();
  const [form, setForm] = useState<FormData | null>(null);

  useEffect(() => {
    if (formId) {
      const saved = localStorage.getItem(formId);
      if (saved) {
        setForm(JSON.parse(saved));
      }
    }
  }, [formId]);

  function handleSubmit(data: any): void {
    alert("Form submitted! Check the console for data.");
    console.log("Form submitted with data:", data);
  }

  if (!form) {
    return <div className="p-8 text-center text-gray-500">Loading form...</div>;
  }
  console.log("Form to render:", form);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      {form.steps.map((step, index) => (
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
                setForm({ ...form, currentStep: form.currentStep - 1 });
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
                setForm({ ...form, currentStep: form.currentStep + 1 });
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