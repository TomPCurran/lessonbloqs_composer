/*
 * API Proxy Route
 * Path: app/api/proxy/[...path]/route.ts
 *
 * Secure proxy for backend API requests with integrated authentication.
 * Uses token service for clean separation of concerns.
 */
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {
  getAuthTokens,
  extractTokenSubject,
  generateApiSignature,
  type SignaturePayload,
} from "@/lib/services/auth/token.service";

// Configuration
const BACKEND_API_URL = process.env.BACKEND_API_URL;

/**
 * Creates headers for backend API requests
 */
function createApiHeaders(options: {
  req: NextRequest;
  userId: string;
  clerkToken: string;
  serviceAccountToken: string;
  targetPath: string;
}): Headers {
  const { req, userId, clerkToken, serviceAccountToken, targetPath } = options;

  const headers = new Headers();
  headers.set(
    "Content-Type",
    req.headers.get("Content-Type") || "application/json"
  );
  headers.set("Accept", req.headers.get("Accept") || "application/json");

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = uuidv4();
  const tokenSub = extractTokenSubject(clerkToken);

  const signaturePayload: SignaturePayload = {
    user_id: userId,
    sub: tokenSub,
    iat: parseInt(timestamp, 10),
    exp: parseInt(timestamp, 10) + 300,
    nonce,
    path: `/${targetPath}`,
    method: req.method,
  };

  const signature = generateApiSignature(signaturePayload);

  headers.set("Authorization", `Bearer ${serviceAccountToken}`);
  headers.set("X-User-Token", clerkToken);
  headers.set("X-Request-Timestamp", timestamp);
  headers.set("X-Request-Nonce", nonce);
  headers.set("X-User-Signature", signature);

  return headers;
}

/**
 * Handles all proxy requests to the backend API
 */
async function handleProxyRequest(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    // Validate backend URL configuration
    if (!BACKEND_API_URL) {
      console.error("Backend API URL not configured");
      throw new Error("Backend API URL not configured");
    }

    // Get authentication tokens
    const authTokens = await getAuthTokens();

    // Build target URL
    const { path } = await context.params;
    const targetPath = path.join("/");
    const targetUrl = new URL(`${BACKEND_API_URL}/${targetPath}`);
    targetUrl.search = req.nextUrl.search;

    // Log request in development
    if (process.env.NODE_ENV === "development") {
      console.log(`Proxy Request: ${req.method} /${targetPath}`);
      console.log(`Target URL: ${targetUrl.toString()}`);
    }

    // Create headers with authentication
    const headers = createApiHeaders({
      req,
      userId: authTokens.userId,
      clerkToken: authTokens.clerkToken,
      serviceAccountToken: authTokens.serviceAccountToken,
      targetPath,
    });

    // Make the proxied request
    const response = await fetch(targetUrl.toString(), {
      method: req.method,
      headers,
      body: req.body,
      // @ts-expect-error - duplex is a valid option but TypeScript types are outdated
      duplex: "half",
    });

    // Log response in development
    if (process.env.NODE_ENV === "development") {
      console.log(`Proxy Response: ${response.status} ${response.statusText}`);
    }

    // Clone response to check if it's JSON
    const responseClone = response.clone();
    let responseBody = null;

    try {
      responseBody = await responseClone.text();
    } catch (error) {
      console.warn("Could not read response body for logging:", error);
    }

    // Log error responses for debugging
    if (!response.ok) {
      console.error(
        `Backend API Error: ${response.status} ${response.statusText}`
      );
      if (responseBody) {
        console.error("Response body:", responseBody);
      }
    }

    // Return the response with CORS headers
    const corsHeaders = new Headers(response.headers);
    corsHeaders.set("Access-Control-Allow-Origin", "*");
    corsHeaders.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    corsHeaders.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("API Proxy Error:", error);

    // Enhanced error handling with detailed responses
    if (error instanceof Error) {
      // Authentication errors
      if (
        error.message.includes("Authentication required") ||
        error.message.includes("sign in")
      ) {
        return NextResponse.json(
          {
            error: "Authentication required",
            detail: error.message,
            code: "AUTH_REQUIRED",
          },
          { status: 401 }
        );
      }

      // Configuration errors
      if (error.message.includes("Backend API URL")) {
        return NextResponse.json(
          {
            error: "Service configuration error",
            detail: "Backend service is not properly configured",
            code: "CONFIG_ERROR",
          },
          { status: 503 }
        );
      }

      // Token errors
      if (
        error.message.includes("token") ||
        error.message.includes("session")
      ) {
        return NextResponse.json(
          {
            error: "Authentication error",
            detail: error.message,
            code: "TOKEN_ERROR",
          },
          { status: 401 }
        );
      }
    }

    // Network or other errors
    return NextResponse.json(
      {
        error: "Internal server error",
        detail: "An unexpected error occurred while processing your request",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}

// Export handlers for all HTTP methods
export const GET = handleProxyRequest;
export const POST = handleProxyRequest;
export const PUT = handleProxyRequest;
export const PATCH = handleProxyRequest;
export const DELETE = handleProxyRequest;
export const OPTIONS = handleProxyRequest;

// Force dynamic rendering
export const dynamic = "force-dynamic";
