// Google Identity Platform authentication service

// API endpoints
const GOOGLE_IDENTITY_API_BASE = "https://identitytoolkit.googleapis.com/v1";
const OAUTH2_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/auth";
const OAUTH2_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

// Configuration from environment variables
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const API_KEY = process.env.GCP_IDENTITY_PLATFORM_API_KEY!;
const TENANT_ID = process.env.GCP_IDENTITY_PLATFORM_TENANT_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// OAuth scopes
const GOOGLE_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
].join(" ");

// User data interface
export interface GoogleUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

// Request body interfaces
interface SignInBody {
  email: string;
  password: string;
  returnSecureToken: true;
  tenantId?: string;
}

interface SignUpBody extends SignInBody {
  displayName?: string;
}

interface RevokeTokenBody {
  token: string;
  tenantId?: string;
}

// Generate random state for OAuth security
export const generateState = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

// Build Google OAuth URL
export const getGoogleAuthUrl = (state: string): string => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: `${APP_URL}/api/auth/callback/google`,
    response_type: "code",
    scope: GOOGLE_SCOPES,
    state: state,
    access_type: "offline",
    prompt: "consent",
  });

  return `${OAUTH2_AUTH_ENDPOINT}?${params.toString()}`;
};

// Exchange authorization code for access token
export const exchangeCodeForToken = async (
  code: string
): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  id_token: string;
}> => {
  const response = await fetch(OAUTH2_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: `${APP_URL}/api/auth/callback/google`,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.statusText}`);
  }

  return response.json();
};

// Verify ID token with Google Identity Platform
export const verifyIdToken = async (idToken: string): Promise<GoogleUser> => {
  let url = `${GOOGLE_IDENTITY_API_BASE}/accounts:lookup?key=${API_KEY}`;

  if (TENANT_ID) {
    url += `&tenantId=${TENANT_ID}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idToken,
    }),
  });

  if (!response.ok) {
    throw new Error(`Token verification failed: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.users || data.users.length === 0) {
    throw new Error("User not found");
  }

  const user = data.users[0];
  return {
    uid: user.localId,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoUrl,
    emailVerified: user.emailVerified,
  };
};

// Sign in with email and password using Google Identity Platform
export const signInWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<{ idToken: string; user: GoogleUser }> => {
  const url = `${GOOGLE_IDENTITY_API_BASE}/accounts:signInWithPassword?key=${API_KEY}`;

  const body: SignInBody = {
    email,
    password,
    returnSecureToken: true,
  };

  if (TENANT_ID) {
    body.tenantId = TENANT_ID;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Sign in failed");
  }

  const data = await response.json();
  const user = await verifyIdToken(data.idToken);

  return {
    idToken: data.idToken,
    user,
  };
};

// Sign up with email and password using Google Identity Platform
export const signUpWithEmailAndPassword = async (
  email: string,
  password: string,
  displayName?: string
): Promise<{ idToken: string; user: GoogleUser }> => {
  const url = `${GOOGLE_IDENTITY_API_BASE}/accounts:signUp?key=${API_KEY}`;

  const body: SignUpBody = {
    email,
    password,
    returnSecureToken: true,
  };

  if (displayName) {
    body.displayName = displayName;
  }

  if (TENANT_ID) {
    body.tenantId = TENANT_ID;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Sign up failed");
  }

  const data = await response.json();
  const user = await verifyIdToken(data.idToken);

  return {
    idToken: data.idToken,
    user,
  };
};

// Send email verification
export const sendVerificationEmail = async (idToken: string): Promise<void> => {
  let url = `${GOOGLE_IDENTITY_API_BASE}/accounts:sendOobCode?key=${API_KEY}`;
  if (TENANT_ID) {
    url += `&tenantId=${TENANT_ID}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      requestType: "VERIFY_EMAIL",
      idToken,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || "Failed to send verification email");
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  let url = `${GOOGLE_IDENTITY_API_BASE}/accounts:sendOobCode?key=${API_KEY}`;
  if (TENANT_ID) {
    url += `&tenantId=${TENANT_ID}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      requestType: "PASSWORD_RESET",
      email,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || "Failed to send reset email");
  }
};

// Sign out (revoke refresh token)
export const signOut = async (idToken: string): Promise<void> => {
  const url = `${GOOGLE_IDENTITY_API_BASE}/accounts:revokeToken?key=${API_KEY}`;

  const body: RevokeTokenBody = {
    token: idToken,
  };

  if (TENANT_ID) {
    body.tenantId = TENANT_ID;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.warn("Token revocation failed, but continuing with sign out");
  }
};

// Get user info from Google
export const getUserInfo = async (
  accessToken: string
): Promise<{
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}> => {
  const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }

  return response.json();
};

// Client-side OAuth initiation
export const initiateGoogleSignIn = (): void => {
  const state = generateState();

  // Store state in sessionStorage for verification
  if (typeof window !== "undefined") {
    sessionStorage.setItem("oauth_state", state);
  }

  const authUrl = getGoogleAuthUrl(state);
  window.location.href = authUrl;
};

// Verify OAuth state
export const verifyOAuthState = (receivedState: string): boolean => {
  if (typeof window === "undefined") return false;

  const storedState = sessionStorage.getItem("oauth_state");
  const isValid = storedState === receivedState;

  // Clean up state after verification
  sessionStorage.removeItem("oauth_state");

  return isValid;
};
