import admin from "firebase-admin";
import fs from "fs";

let serviceAccount: admin.ServiceAccount;

// Always read the local JSON file
try {
  const jsonData = fs.readFileSync("firebaseAdminSDK.json", "utf-8");
  serviceAccount = JSON.parse(jsonData) as admin.ServiceAccount;
} catch (error: any) {
  throw new Error(
    `FATAL ERROR: Unable to load firebaseAdminSDK.json. Error: ${error.message}`
  );
}

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
