/*
 * Token Service
 * Path: lib/services/auth/token.service.ts
 *
 * Centralized service for handling authentication token generation.
 * Separates token logic from the proxy route for better maintainability.
 */
import { auth } from "@clerk/nextjs/server";
import { GoogleAuth } from "google-auth-library";
import jwt from "jsonwebtoken";

// Environment variables validation
const validateTokenEnvironment = () => {
  const required = [
    "BACKEND_SERVICE_ACCOUNT_EMAIL",
    "BACKEND_SERVICE_ACCOUNT_PRIVATE_KEY",
    "GOOGLE_CLIENT_ID",
    "API_SIGNING_KEY",
  ];

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
};

// Types
export interface AuthTokens {
  clerkToken: string;
  serviceAccountToken: string;
  userId: string;
}

export interface SignaturePayload {
  user_id: string;
  sub: string | null;
  iat: number;
  exp: number;
  nonce: string;
  path: string;
  method: string;
}

/**
 * Gets Google Service Account token for backend authentication
 */
async function getGoogleServiceAccountToken(audience: string): Promise<string> {
  const auth = new GoogleAuth({
    credentials: {
      client_email: process.env.BACKEND_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.BACKEND_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(
        /\\n/g,
        "\n"
      ),
    },
  });

  const client = await auth.getIdTokenClient(audience);
  const token = await client.idTokenProvider.fetchIdToken(audience);
  return token;
}

/**
 * Extracts the subject (sub) claim from a JWT token
 */
export function extractTokenSubject(token: string): string | null {
  try {
    const decoded = jwt.decode(token);
    if (typeof decoded === "object" && decoded !== null && "sub" in decoded) {
      return decoded.sub as string;
    }
    return null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

/**
 * Generates an API signature for request authentication
 */
export function generateApiSignature(payload: SignaturePayload): string {
  const signingKey = process.env.API_SIGNING_KEY!;
  return jwt.sign(payload, signingKey, { algorithm: "HS256" });
}

/**
 * Gets all required authentication tokens for API requests
 */
export async function getAuthTokens(): Promise<AuthTokens> {
  validateTokenEnvironment();

  // Get Clerk session
  const session = await auth();
  if (!session.userId) {
    throw new Error("Authentication required. Please sign in.");
  }

  // Get Clerk token
  const clerkToken = await session.getToken();
  if (!clerkToken) {
    throw new Error("Could not retrieve a valid user session token.");
  }

  // Get service account token
  const googleClientId = process.env.GOOGLE_CLIENT_ID!;
  const serviceAccountToken = await getGoogleServiceAccountToken(
    googleClientId
  );

  return {
    clerkToken,
    serviceAccountToken,
    userId: session.userId,
  };
}
