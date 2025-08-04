import React from "react";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "medium" | "large";
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
  size = "medium",
  fullScreen = false,
}) => {
  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-16 w-16",
    large: "h-24 w-24",
  };

  const textSizes = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const spinner = (
    <div className="min-h-screen text-center bg-gradient-to-r from-emerald-50 via-indigo-100 to-amber-100 shadow-lg">
      <div
        className={`animate-spin rounded-full border-b-2 border-indigo-600 mx-auto mb-4 ${sizeClasses[size]}`}
      ></div>
      <p className={`text-gray-600 font-medium ${textSizes[size]}`}>
        {message}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-emerald-50 via-indigo-100 to-amber-100 shadow-lg flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
