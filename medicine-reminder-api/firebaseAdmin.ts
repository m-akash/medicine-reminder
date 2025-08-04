import admin from "firebase-admin";

const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

if (!FIREBASE_PROJECT_ID) {
  throw new Error("FATAL ERROR: The FIREBASE_PROJECT_ID environment variable is not set.");
}

if (!FIREBASE_CLIENT_EMAIL) {
  throw new Error("FATAL ERROR: The FIREBASE_CLIENT_EMAIL environment variable is not set.");
}

if (!FIREBASE_PRIVATE_KEY) {
  throw new Error("FATAL ERROR: The FIREBASE_PRIVATE_KEY environment variable is not set.");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

export default admin;
