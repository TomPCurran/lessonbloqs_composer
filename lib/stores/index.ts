// Export all Zustand stores
export { useUIStore } from "./uiStore";
export { useDocumentStore } from "./documentStore";
export {
  ONBOARDING_FORM_ID,
  getOnboardingFormValues,
  getOnboardingFormErrors,
  getOnboardingFormSubmitting,
  getOnboardingFormValid,
} from "./formStore";
export { useFormStore } from "./formStore";

// Store types for external use
export type { UIState } from "./uiStore";
export type { DocumentState } from "./documentStore";
export type { FormState } from "./formStore";
