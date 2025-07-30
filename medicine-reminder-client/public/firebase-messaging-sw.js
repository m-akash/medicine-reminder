importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBlVWI9Ip-nfGjqMFjrdHI-AgvdwkEvi3g",
  authDomain: "medirem-ad076.firebaseapp.com",
  projectId: "medirem-ad076",
  storageBucket: "medirem-ad076.firebasestorage.app",
  messagingSenderId: "550317740158",
  appId: "1:550317740158:web:c818c9d38bf86ca8c0082f",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Background message received:', payload);
  
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png",
    badge: "/icon.png",
    tag: "medicine-reminder",
    requireInteraction: true,
    actions: [
      {
        action: "take",
        title: "Take Medicine",
        icon: "/icon.png"
      },
      {
        action: "dismiss",
        title: "Dismiss",
        icon: "/icon.png"
      }
    ]
  });
});
