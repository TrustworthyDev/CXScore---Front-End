import React, { useState, useEffect, ReactNode } from "react";

interface ToastProps {
  children: ReactNode;
  type?: "success" | "failure";
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({
  children,
  type = "success",
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose && onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const toastClass = `toast fixed bottom-4 right-4 p-2 max-w-xs break-words rounded-lg shadow-md ${
    type === "success" ? "bg-green-500" : "bg-red-500"
  }`;
  const messageClass = "toast-message";

  return visible ? <div className={toastClass}>{children}</div> : null;
};

export default Toast;
