# Form Builder

A modern, feature-rich form builder built with React Remix and Tailwind CSS. This application allows users to create, customize, and share forms with a beautiful drag-and-drop interface.

## Features

- 🎨 Modern, responsive UI with dark mode support
- 🖱️ Drag-and-drop form field management (add, reorder, remove)
- 📱 Responsive preview modes (Desktop, Tablet, Mobile)
- 🔄 Multi-step form support with step navigation and progress indicator
- 📝 Field types:
  - Text Input
  - Text Area
  - Dropdown
  - Checkbox
  - Date
  - Email
  - Phone
- ⚙️ Field configuration:
  - Labels
  - Placeholders
  - Required fields
  - Help text
  - Validation rules (required, min/max length, pattern, email/phone)
- 📋 Form templates
  - Predefined templates (e.g., Contact Us)
  - Save/load custom templates (localStorage or API)
- 🔗 Shareable form links
  - Generate a shareable Form ID and public “Form Filler” view
  - Load form by ID for filling
- 💾 Auto-save to localStorage
- 📥 View submitted responses per form
- ♿ Accessibility support
- 🌓 Dark/Light theme toggle
- ↩️ Undo/Redo functionality
- 🛠️ Zustand state management with persistence and hydration handling
- 🧩 Drag-and-drop powered by @dnd-kit (with SortableField component)
- 🧪 Real-time form preview with validation
- 🗑️ Remove fields and steps
- 📝 Edit form title inline

## Tech Stack

- [React Remix](https://remix.run/) - Full-stack web framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [@dnd-kit](https://dndkit.com/) - Drag and drop toolkit
- [React Hook Form](https://react-hook-form.com/) - Form validation
- [Zod](https://github.com/colinhacks/zod) - Schema validation
- [Heroicons](https://heroicons.com/) - Beautiful hand-crafted SVG icons

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd form-builder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── components/         # Reusable components
│   ├── FieldConfig.tsx      # Field configuration panel
│   ├── FormPreview.tsx      # Form preview component
│   ├── StepManager.tsx      # Step management component
│   ├── TemplateManager.tsx  # Template management component
│   └── SortableField.tsx    # Drag-and-drop sortable field wrapper
├── routes/            # Application routes
│   ├── _index.tsx          # Main form builder page
│   └── form.$formId.tsx    # Form filler view
├── store/             # State management
│   └── formBuilderStore.ts # Zustand store
└── styles/            # Global styles
    └── tailwind.css        # Tailwind CSS imports
```

## Usage

1. **Creating a Form**
   - Click "Add Field" to add form fields
   - Drag and drop fields to reorder them (using mouse or trackpad)
   - Click on a field to configure its properties (label, placeholder, required, etc.)
   - Use the preview panel to see how the form looks and behaves

2. **Managing Steps**
   - Add multiple steps to create a multi-step form
   - Use the step manager to navigate between steps
   - Configure fields for each step

3. **Using Templates**
   - Choose from predefined templates
   - Save your forms as templates
   - Load saved templates

4. **Sharing Forms**
   - Click the "Share" button to generate a shareable link
   - Share the link with others to let them fill out the form

5. **Viewing Responses**
   - View a list of submitted responses for each form you created
   - Export responses if needed

6. **Undo/Redo**
   - Use undo/redo controls to revert or reapply changes to your form

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking


