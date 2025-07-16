import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;

declare global {
  interface ImportMetaEnv {
    readonly VITE_apiKey: string;
    readonly VITE_authDomain: string;
    readonly VITE_projectId: string;
    readonly VITE_storageBucket: string;
    readonly VITE_messagingSenderId: string;
    readonly VITE_appId: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
