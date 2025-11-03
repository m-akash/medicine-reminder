import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";

// Ensure these variable names match the ones used in your service worker (sw.ts)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase app if minimum auth keys exist; others are optional for auth
const requiredForAuth: Array<keyof typeof firebaseConfig> = [
  "apiKey",
  "authDomain",
  "projectId",
  "appId",
];
const missingAuthKeys = requiredForAuth.filter((k) => !firebaseConfig[k]);

let app: ReturnType<typeof initializeApp> | undefined;
if (missingAuthKeys.length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  // Prevent hard crash during local dev when env vars are missing
  console.warn(
    `Firebase not initialized. Missing env keys: ${missingAuthKeys.join(
      ", "
    )}. ` +
      "Add VITE_FIREBASE_* vars to medicine-reminder-client/.env.local and restart the dev server."
  );
}

const auth = app
  ? getAuth(app)
  : (undefined as unknown as ReturnType<typeof getAuth>);
// Only set up messaging if app is ready and sender id is provided
export const messaging =
  app && firebaseConfig.messagingSenderId ? getMessaging(app) : undefined;

export async function requestFCMToken() {
  try {
    if (!messaging) {
      return null;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
      const swRegistration = await navigator.serviceWorker.ready;
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_VAPID_KEY,
        serviceWorkerRegistration: swRegistration,
      });
      console.log("FCM Token received:", token);
      return token;
    } else {
      console.warn("Notification permission denied.");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while retrieving token.", error);
    return null;
  }
}

export default auth;
