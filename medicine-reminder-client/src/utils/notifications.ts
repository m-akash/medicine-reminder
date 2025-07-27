import { toast } from "react-toastify";
import Swal from "sweetalert2";

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  },

  error: (message: string) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  },

  warning: (message: string) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  },

  info: (message: string) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  },
};

export const showConfirm = {
  delete: (
    title: string = "Are you sure?",
    text: string = "This action cannot be undone."
  ) => {
    return Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });
  },

  update: (
    title: string = "Update Confirmation",
    text: string = "Are you sure you want to update this?"
  ) => {
    return Swal.fire({
      title,
      text,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });
  },

  markAsTaken: (medicineName: string) => {
    return Swal.fire({
      title: "Mark as Taken?",
      text: `Are you sure you want to mark "${medicineName}" as taken?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, mark as taken!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });
  },
};

export const showAlert = {
  success: (title: string, text?: string) => {
    Swal.fire({
      title,
      text,
      icon: "success",
      confirmButtonColor: "#10b981",
      timer: 2000,
      timerProgressBar: true,
    });
  },

  error: (title: string, text?: string) => {
    Swal.fire({
      title,
      text,
      icon: "error",
      confirmButtonColor: "#ef4444",
    });
  },

  warning: (title: string, text?: string) => {
    Swal.fire({
      title,
      text,
      icon: "warning",
      confirmButtonColor: "#f59e0b",
    });
  },

  info: (title: string, text?: string) => {
    Swal.fire({
      title,
      text,
      icon: "info",
      confirmButtonColor: "#3b82f6",
    });
  },
};

export const medicineNotifications = {
  added: (medicineName: string) => {
    showToast.success(`${medicineName} has been added successfully!`);
  },

  updated: (medicineName: string) => {
    showToast.success(`${medicineName} has been updated successfully!`);
  },

  deleted: (medicineName: string) => {
    showToast.success(`${medicineName} has been deleted successfully!`);
  },

  markedAsTaken: (medicineName: string) => {
    showToast.success(`${medicineName} marked as taken!`);
  },

  refillReminder: (medicineName: string) => {
    showAlert.warning(
      "Refill Reminder",
      `${medicineName} is running low. Please refill your prescription.`
    );
  },

  missedDose: (medicineName: string) => {
    showAlert.warning(
      "Missed Dose",
      `You missed your dose of ${medicineName}. Please take it as soon as possible.`
    );
  },
};

export const authNotifications = {
  loginSuccess: () => {
    showToast.success("Welcome back! You have been logged in successfully.");
  },

  loginError: (message: string) => {
    showToast.error(message || "Login failed. Please check your credentials.");
  },

  registerSuccess: () => {
    showAlert.success(
      "Registration Successful!",
      "Your account has been created successfully. Please log in."
    );
  },

  registerError: (message: string) => {
    showToast.error(message || "Registration failed. Please try again.");
  },

  logoutSuccess: () => {
    showToast.info("You have been logged out successfully.");
  },

  unauthorized: () => {
    showAlert.error("Access Denied", "Please log in to access this feature.");
  },
};

export const formNotifications = {
  requiredField: (fieldName: string) => {
    showToast.warning(`Please fill in the ${fieldName} field.`);
  },

  invalidEmail: () => {
    showToast.error("Please enter a valid email address.");
  },

  passwordMismatch: () => {
    showToast.error("Passwords do not match. Please try again.");
  },

  weakPassword: () => {
    showToast.warning("Password should be at least 6 characters long.");
  },
};

export const apiNotifications = {
  networkError: () => {
    showToast.error("Network error. Please check your internet connection.");
  },

  serverError: () => {
    showToast.error("Server error. Please try again later.");
  },

  timeout: () => {
    showToast.error("Request timeout. Please try again.");
  },

  unauthorized: () => {
    showAlert.error(
      "Unauthorized",
      "You are not authorized to perform this action. Please log in again."
    );
  },

  forbidden: () => {
    showAlert.error(
      "Access Forbidden",
      "You do not have permission to access this resource."
    );
  },

  notFound: () => {
    showToast.error("The requested resource was not found.");
  },

  genericError: (message: string) => {
    showToast.error(message);
  },
};
