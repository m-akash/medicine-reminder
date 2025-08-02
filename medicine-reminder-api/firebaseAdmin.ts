import admin from "firebase-admin";
import fs from "fs";

let serviceAccount: admin.ServiceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    let raw = process.env.FIREBASE_SERVICE_ACCOUNT;

    // If it starts and ends with quotes, remove them and unescape inner quotes
    if (raw.startsWith('"') && raw.endsWith('"')) {
      raw = raw.slice(1, -1).replace(/\\"/g, '"');
    }

    serviceAccount = JSON.parse(raw) as admin.ServiceAccount;
  } catch (error: any) {
    throw new Error(
      `Failed to parse FIREBASE_SERVICE_ACCOUNT. Please ensure it's valid JSON string. Error: ${error.message}`
    );
  }
} else if (process.env.NODE_ENV !== "production") {
  // Local fallback (dev only)
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
