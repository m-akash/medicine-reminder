import admin from "firebase-admin";
import fs from "fs";

let serviceAccount: admin.ServiceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT
    ) as admin.ServiceAccount;
  } catch (error: any) {
    throw new Error(
      `Failed to parse FIREBASE_SERVICE_ACCOUNT. Please ensure it's a valid JSON string. Error: ${error.message}`
    );
  }
} else if (process.env.NODE_ENV !== "production") {
  // Fallback for local development ONLY. This will fail on Vercel.
  serviceAccount = JSON.parse(
    fs.readFileSync("firebaseAdminSDK.json", "utf-8")
  ) as admin.ServiceAccount;
} else {
  throw new Error(
    "FATAL ERROR: The FIREBASE_SERVICE_ACCOUNT environment variable is not set in production."
  );
}
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
