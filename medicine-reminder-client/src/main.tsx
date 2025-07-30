import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Main.tsx";
import AuthProvider from "./context/AuthProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PWARegistration from "./components/PWARegistration.tsx";
import OfflinePage from "./components/OfflinePage.tsx";
import InstallPrompt from "./components/InstallPrompt.tsx";

const queryClient = new QueryClient();

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("/firebase-messaging-sw.js")
//     .then((registration) => {
//       console.log("✅ FCM SW registered:", registration);
//     })
//     .catch((err) => console.error("❌ FCM SW registration failed:", err));
// }

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <PWARegistration />
          <OfflinePage />
          <InstallPrompt />
        </QueryClientProvider>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>
);
