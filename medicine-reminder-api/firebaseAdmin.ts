import admin from "firebase-admin";
import fs from "fs";

let serviceAccount: admin.ServiceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT
  ) as admin.ServiceAccount;
} else if (process.env.NODE_ENV !== 'production') {
  // Fallback for local development ONLY. This will fail on Vercel.
  serviceAccount = JSON.parse(fs.readFileSync("firebaseAdminSDK.json", "utf-8")) as admin.ServiceAccount;
} else {
  throw new Error("FATAL ERROR: FIREBASE_SERVICE_ACCOUNT environment variable not set in production.");
}
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
