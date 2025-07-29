export {};

export type Roles =
  | "admin"
  | "teacher"
  | "team_lead"
  | "district_admin"
  | "super_admin"
  | "user"
  | "counselor"
  | "special_ed";
declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
      role?: Roles;
    };
  }
}
