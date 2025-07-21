import { create } from "zustand";
import { persist } from "zustand/middleware";

// Form State interface
export interface FormState {
  // Contact form state
  contactForm: {
    name: string;
    email: string;
    subject: string;
    message: string;
    role: string;
    errors: Record<string, string>;
    isSubmitting: boolean;
    submitSuccess: boolean;
    lastSubmitted: number | null;
  };

  // Document editing state (non-collaborative UI state)
  documentEditing: {
    title: string;
    isEditing: boolean;
    hasUnsavedChanges: boolean;
    lastSaved: number;
    autoSaveEnabled: boolean;
  };

  // Document sharing form state
  shareForm: {
    email: string;
    permission: "viewer" | "editor";
    errors: Record<string, string>;
    isSubmitting: boolean;
    lastShared: number | null;
  };

  // Generic form state for other forms
  genericForms: Record<
    string,
    {
      values: Record<string, string | number | boolean>;
      errors: Record<string, string>;
      isSubmitting: boolean;
      isValid: boolean;
    }
  >;

  // Actions for contact form
  updateContactForm: (field: string, value: string) => void;
  setContactFormErrors: (errors: Record<string, string>) => void;
  setContactFormSubmitting: (submitting: boolean) => void;
  setContactFormSuccess: (success: boolean) => void;
  resetContactForm: () => void;
  validateContactForm: () => Record<string, string>;

  // Actions for document editing
  updateDocumentTitle: (title: string) => void;
  setDocumentEditing: (editing: boolean) => void;
  setDocumentUnsavedChanges: (hasChanges: boolean) => void;
  setDocumentLastSaved: (timestamp: number) => void;
  setDocumentAutoSave: (enabled: boolean) => void;
  resetDocumentEditing: () => void;

  // Actions for share form
  updateShareForm: (field: string, value: string) => void;
  setShareFormErrors: (errors: Record<string, string>) => void;
  setShareFormSubmitting: (submitting: boolean) => void;
  setShareFormSuccess: (timestamp: number) => void;
  resetShareForm: () => void;
  validateShareForm: () => Record<string, string>;

  // Actions for generic forms
  updateGenericForm: (
    formId: string,
    field: string,
    value: string | number | boolean
  ) => void;
  setGenericFormErrors: (
    formId: string,
    errors: Record<string, string>
  ) => void;
  setGenericFormSubmitting: (formId: string, submitting: boolean) => void;
  setGenericFormValid: (formId: string, valid: boolean) => void;
  resetGenericForm: (formId: string) => void;

  // Utility actions
  clearAllForms: () => void;
  getFormState: (formId: string) => {
    values: Record<string, string | number | boolean>;
    errors: Record<string, string>;
    isSubmitting: boolean;
    isValid: boolean;
  } | null;
}

// Create the form store with selective persistence
export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      // Initial state
      contactForm: {
        name: "",
        email: "",
        subject: "",
        message: "",
        role: "teacher",
        errors: {},
        isSubmitting: false,
        submitSuccess: false,
        lastSubmitted: null,
      },

      documentEditing: {
        title: "",
        isEditing: false,
        hasUnsavedChanges: false,
        lastSaved: Date.now(),
        autoSaveEnabled: true,
      },

      shareForm: {
        email: "",
        permission: "viewer",
        errors: {},
        isSubmitting: false,
        lastShared: null,
      },

      genericForms: {},

      // Contact form actions
      updateContactForm: (field, value) => {
        const { contactForm } = get();
        const updatedForm = {
          ...contactForm,
          [field]: value,
          // Clear error for this field when user starts typing
          errors: {
            ...contactForm.errors,
            [field]: "",
          },
        };

        set({ contactForm: updatedForm });
      },

      setContactFormErrors: (errors) => {
        const { contactForm } = get();
        set({
          contactForm: {
            ...contactForm,
            errors,
          },
        });
      },

      setContactFormSubmitting: (submitting) => {
        const { contactForm } = get();
        set({
          contactForm: {
            ...contactForm,
            isSubmitting: submitting,
          },
        });
      },

      setContactFormSuccess: (success) => {
        const { contactForm } = get();
        set({
          contactForm: {
            ...contactForm,
            submitSuccess: success,
            lastSubmitted: success ? Date.now() : null,
          },
        });
      },

      resetContactForm: () => {
        set({
          contactForm: {
            name: "",
            email: "",
            subject: "",
            message: "",
            role: "teacher",
            errors: {},
            isSubmitting: false,
            submitSuccess: false,
            lastSubmitted: null,
          },
        });
      },

      validateContactForm: () => {
        const { contactForm } = get();
        const errors: Record<string, string> = {};

        if (!contactForm.name.trim()) {
          errors.name = "Name is required";
        }

        if (!contactForm.email.trim()) {
          errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(contactForm.email)) {
          errors.email = "Email is invalid";
        }

        if (!contactForm.message.trim()) {
          errors.message = "Message is required";
        }

        return errors;
      },

      // Document editing actions
      updateDocumentTitle: (title) => {
        const { documentEditing } = get();
        set({
          documentEditing: {
            ...documentEditing,
            title,
            hasUnsavedChanges: true,
          },
        });
      },

      setDocumentEditing: (editing) => {
        const { documentEditing } = get();
        set({
          documentEditing: {
            ...documentEditing,
            isEditing: editing,
          },
        });
      },

      setDocumentUnsavedChanges: (hasChanges) => {
        const { documentEditing } = get();
        set({
          documentEditing: {
            ...documentEditing,
            hasUnsavedChanges: hasChanges,
          },
        });
      },

      setDocumentLastSaved: (timestamp) => {
        const { documentEditing } = get();
        set({
          documentEditing: {
            ...documentEditing,
            lastSaved: timestamp,
            hasUnsavedChanges: false,
          },
        });
      },

      setDocumentAutoSave: (enabled) => {
        const { documentEditing } = get();
        set({
          documentEditing: {
            ...documentEditing,
            autoSaveEnabled: enabled,
          },
        });
      },

      resetDocumentEditing: () => {
        set({
          documentEditing: {
            title: "",
            isEditing: false,
            hasUnsavedChanges: false,
            lastSaved: Date.now(),
            autoSaveEnabled: true,
          },
        });
      },

      // Share form actions
      updateShareForm: (field, value) => {
        const { shareForm } = get();
        const updatedForm = {
          ...shareForm,
          [field]: value,
          errors: {
            ...shareForm.errors,
            [field]: "",
          },
        };

        set({ shareForm: updatedForm });
      },

      setShareFormErrors: (errors) => {
        const { shareForm } = get();
        set({
          shareForm: {
            ...shareForm,
            errors,
          },
        });
      },

      setShareFormSubmitting: (submitting) => {
        const { shareForm } = get();
        set({
          shareForm: {
            ...shareForm,
            isSubmitting: submitting,
          },
        });
      },

      setShareFormSuccess: (timestamp) => {
        const { shareForm } = get();
        set({
          shareForm: {
            ...shareForm,
            lastShared: timestamp,
          },
        });
      },

      resetShareForm: () => {
        set({
          shareForm: {
            email: "",
            permission: "viewer",
            errors: {},
            isSubmitting: false,
            lastShared: null,
          },
        });
      },

      validateShareForm: () => {
        const { shareForm } = get();
        const errors: Record<string, string> = {};

        if (!shareForm.email.trim()) {
          errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(shareForm.email)) {
          errors.email = "Email is invalid";
        }

        return errors;
      },

      // Generic form actions
      updateGenericForm: (formId, field, value) => {
        const { genericForms } = get();
        const currentForm = genericForms[formId] || {
          values: {},
          errors: {},
          isSubmitting: false,
          isValid: false,
        };

        const updatedForm = {
          ...currentForm,
          values: {
            ...currentForm.values,
            [field]: value,
          },
          errors: {
            ...currentForm.errors,
            [field]: "",
          },
        };

        set({
          genericForms: {
            ...genericForms,
            [formId]: updatedForm,
          },
        });
      },

      setGenericFormErrors: (formId, errors) => {
        const { genericForms } = get();
        const currentForm = genericForms[formId];

        if (currentForm) {
          set({
            genericForms: {
              ...genericForms,
              [formId]: {
                ...currentForm,
                errors,
              },
            },
          });
        }
      },

      setGenericFormSubmitting: (formId, submitting) => {
        const { genericForms } = get();
        const currentForm = genericForms[formId];

        if (currentForm) {
          set({
            genericForms: {
              ...genericForms,
              [formId]: {
                ...currentForm,
                isSubmitting: submitting,
              },
            },
          });
        }
      },

      setGenericFormValid: (formId, valid) => {
        const { genericForms } = get();
        const currentForm = genericForms[formId];

        if (currentForm) {
          set({
            genericForms: {
              ...genericForms,
              [formId]: {
                ...currentForm,
                isValid: valid,
              },
            },
          });
        }
      },

      resetGenericForm: (formId) => {
        const { genericForms } = get();
        const remainingForms = { ...genericForms };
        delete remainingForms[formId];

        set({ genericForms: remainingForms });
      },

      // Utility actions
      clearAllForms: () => {
        set({
          contactForm: {
            name: "",
            email: "",
            subject: "",
            message: "",
            role: "teacher",
            errors: {},
            isSubmitting: false,
            submitSuccess: false,
            lastSubmitted: null,
          },
          documentEditing: {
            title: "",
            isEditing: false,
            hasUnsavedChanges: false,
            lastSaved: Date.now(),
            autoSaveEnabled: true,
          },
          shareForm: {
            email: "",
            permission: "viewer",
            errors: {},
            isSubmitting: false,
            lastShared: null,
          },
          genericForms: {},
        });
      },

      getFormState: (formId) => {
        const { genericForms } = get();
        return genericForms[formId] || null;
      },
    }),
    {
      name: "form-storage",
      partialize: (state) => ({
        // Only persist user preferences and form settings
        documentEditing: {
          autoSaveEnabled: state.documentEditing.autoSaveEnabled,
        },
        // Don't persist form data for privacy/security
      }),
    }
  )
);
