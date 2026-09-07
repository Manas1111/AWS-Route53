"use client";

import React, { useEffect } from "react";

export interface NotificationState {
  type: "success" | "error";
  message: string;
}

interface NotificationToastProps {
  notification: NotificationState | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
}) => {
  useEffect(() => {
    if (notification && notification.type === "success") {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const isSuccess = notification.type === "success";

  return (
    <div
      className={`aws-toast ${isSuccess ? "success" : "error"}`}
      role="alert"
    >
      <div className="aws-toast-content">
        <span className="aws-toast-icon">{isSuccess ? "✓" : "⚠"}</span>
        <span className="aws-toast-message">{notification.message}</span>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="aws-toast-close"
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
};
