import { createContext, useEffect, useState } from "react";

interface toastProps {
  id: string;
  message: string;
  variant: string;
}

interface ToastContextType {
  toasts: toastProps[];
  handleCreateToast: (message: string, variant: string) => void;
  handleDismiss: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType>({
  toasts: [],
  handleCreateToast: () => {},
  handleDismiss: () => {},
});

function ToastProvider({ children }: any) {
  const [toasts, setToasts] = useState<toastProps[]>([]);

  function handleDismiss(id: string) {
    const nextToasts = toasts.filter((toast) => {
      return toast.id !== id;
    });

    setToasts(nextToasts);
  }

  const handleCreateToast = (message: string, variant: string) => {
    const nextToasts = [
      ...toasts,
      {
        id: crypto.randomUUID(),
        message,
        variant,
      },
    ];

    setToasts(nextToasts);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (toasts.length > 0) {
        setToasts((prev) => {
          const newToasts = [...prev];
          newToasts.shift();
          return newToasts;
        });
      }
    }, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, [toasts.length]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        handleCreateToast,
        handleDismiss,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export default ToastProvider;
