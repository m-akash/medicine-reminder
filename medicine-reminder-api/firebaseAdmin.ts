import admin from "firebase-admin";
import fs from "fs";

let serviceAccount: admin.ServiceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT
  ) as admin.ServiceAccount;
} else {
  serviceAccount = JSON.parse(
    fs.readFileSync("src/utils/firebaseAdminSDK.json", "utf-8")
  ) as admin.ServiceAccount;
}
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
