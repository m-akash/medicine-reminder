import { useCallback } from "react";
import { apiNotifications } from "../utils/notifications.js";

interface ApiError {
  message?: string;
  status?: number;
  statusText?: string;
}

export const useApiError = () => {
  const handleError = useCallback((error: ApiError | any) => {
    console.error("API Error:", error);
    if (error?.status === 401) {
      apiNotifications.unauthorized();
    } else if (error?.status === 403) {
      apiNotifications.forbidden();
    } else if (error?.status === 404) {
      apiNotifications.notFound();
    } else if (error?.status >= 500) {
      apiNotifications.serverError();
    } else if (
      error?.code === "NETWORK_ERROR" ||
      error?.message?.includes("Network Error")
    ) {
      apiNotifications.networkError();
    } else if (
      error?.code === "ECONNABORTED" ||
      error?.message?.includes("timeout")
    ) {
      apiNotifications.timeout();
    } else {
      const message =
        error?.message || error?.statusText || "An unexpected error occurred";
      apiNotifications.genericError(message);
    }
  }, []);

  return { handleError };
};
