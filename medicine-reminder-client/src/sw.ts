/// <reference lib="WebWorker" />

import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

declare const self: ServiceWorkerGlobalScope;
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
  console.log("[sw.ts] Received background message ", payload);
  const notificationTitle = payload.notification?.title ?? "Medicine Reminder";
  const notificationOptions = {
    body: payload.notification?.body ?? "Time to take your medicine!",
    icon: "/icon.png",
    badge: "/icon.png",
    tag: "medicine-reminder",
    requireInteraction: true,
    actions: [
      {
        action: "take",
        title: "Take Medicine",
        icon: "/icon.png",
      },
      {
        action: "dismiss",
        title: "Dismiss",
        icon: "/icon.png",
      },
    ],
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Optional: Add a listener for when the user clicks on the notification
self.addEventListener("notificationclick", (event) => {
  console.log("[sw.ts] Notification click received.", event.notification);
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === "/" && "focus" in client) return client.focus();
        }
        if (self.clients.openWindow) return self.clients.openWindow("/");
      })
  );
});
