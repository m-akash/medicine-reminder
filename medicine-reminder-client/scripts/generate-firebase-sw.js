// Script to generate firebase-messaging-sw.js with environment variables
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { dirname } from 'path';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables based on the current environment
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
try {
  dotenv.config({ path: envFile });
  console.log(`Loaded environment variables from ${envFile}`);
} catch (error) {
  console.warn(`Warning: Could not load ${envFile}. Using process.env variables.`);
}

// Try to get Firebase configuration from environment variables
let firebaseConfig = {
  apiKey: process.env.VITE_apiKey,
  authDomain: process.env.VITE_authDomain,
  projectId: process.env.VITE_projectId,
  storageBucket: process.env.VITE_storageBucket,
  messagingSenderId: process.env.VITE_messagingSenderId,
  appId: process.env.VITE_appId,
};

// Check if any config values are missing
const missingVars = Object.entries(firebaseConfig)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

// If any values are missing, try to extract them from the existing service worker file
if (missingVars.length > 0) {
  console.warn(`Warning: Missing Firebase configuration variables: ${missingVars.join(', ')}`);
  console.warn('Attempting to extract configuration from existing service worker file...');
  
  try {
    const existingSwPath = path.resolve(__dirname, '../public/firebase-messaging-sw.js');
    if (fs.existsSync(existingSwPath)) {
      const existingSwContent = fs.readFileSync(existingSwPath, 'utf8');
      
      // Extract Firebase config using direct string extraction
       // The format in the file is:
       // firebase.initializeApp({
       //   apiKey: "AIzaSyBlVWI9Ip-nfGjqMFjrdHI-AgvdwkEvi3g",
       //   ...
       // });
       
       // Extract each config value directly
       const extractValue = (key) => {
         const regex = new RegExp(`${key}:\s*"([^"]+)"`);
         const match = existingSwContent.match(regex);
         if (match && match[1]) {
           console.log(`Found ${key}: ${match[1]}`);
           return match[1];
         }
         return null;
       };
       
       // Update missing values with extracted values
       if (!firebaseConfig.apiKey) firebaseConfig.apiKey = extractValue('apiKey');
       if (!firebaseConfig.authDomain) firebaseConfig.authDomain = extractValue('authDomain');
       if (!firebaseConfig.projectId) firebaseConfig.projectId = extractValue('projectId');
       if (!firebaseConfig.storageBucket) firebaseConfig.storageBucket = extractValue('storageBucket');
       if (!firebaseConfig.messagingSenderId) firebaseConfig.messagingSenderId = extractValue('messagingSenderId');
       if (!firebaseConfig.appId) firebaseConfig.appId = extractValue('appId');
       
       console.log('Successfully extracted Firebase configuration from existing service worker');
    }
  } catch (error) {
    console.error('Error extracting configuration from existing service worker:', error);
  }
  
  // Check again if any values are still missing
  const stillMissingVars = Object.entries(firebaseConfig)
    .filter(([_, value]) => !value)
    .map(([key]) => key);
  
  if (stillMissingVars.length > 0) {
    console.error(`Error: Still missing required Firebase configuration variables: ${stillMissingVars.join(', ')}`);
    console.error('Make sure these variables are defined in your environment or .env file.');
    process.exit(1);
  }
}

// Create the service worker content
const serviceWorkerContent = `// This file is auto-generated during the build process. Do not edit directly.
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp(${JSON.stringify(firebaseConfig, null, 2)});

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
`;

// Write the service worker file
const outputDir = path.resolve(__dirname, '../public');
const outputFile = path.join(outputDir, 'firebase-messaging-sw.js');

fs.writeFileSync(outputFile, serviceWorkerContent);
console.log(`Generated Firebase Messaging Service Worker at ${outputFile}`);