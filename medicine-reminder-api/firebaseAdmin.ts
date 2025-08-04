import admin from "firebase-admin";

const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL } = process.env;
let { FIREBASE_PRIVATE_KEY } = process.env;

if (!FIREBASE_PROJECT_ID) {
  throw new Error(
    "FATAL ERROR: The FIREBASE_PROJECT_ID environment variable is not set."
  );
}

if (!FIREBASE_CLIENT_EMAIL) {
  throw new Error(
    "FATAL ERROR: The FIREBASE_CLIENT_EMAIL environment variable is not set."
  );
}

if (!FIREBASE_PRIVATE_KEY) {
  throw new Error(
    "FATAL ERROR: The FIREBASE_PRIVATE_KEY environment variable is not set."
  );
}

// Strip Railway quotes if they exist
if (
  FIREBASE_PRIVATE_KEY.startsWith('"') &&
  FIREBASE_PRIVATE_KEY.endsWith('"')
) {
  FIREBASE_PRIVATE_KEY = FIREBASE_PRIVATE_KEY.slice(1, -1);
}

// Replace escaped \n with actual newlines
FIREBASE_PRIVATE_KEY = FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY,
      }),
    });
    console.log("✅ Firebase Admin initialized successfully");
  } catch (error: any) {
    console.error("❌ Firebase initialization error:", error.message);
    throw error;
  }
}

export default admin;
