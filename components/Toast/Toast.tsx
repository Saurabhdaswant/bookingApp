import React, { useContext } from "react";
import { X } from "react-feather";
import {
  variantError,
  variantNotice,
  variantSuccess,
  variantWarning,
} from "../../utils/contants";
import { ToastContext } from "./ToastProvider";

interface toastProps {
  id: string;
  variant: string;
  children: React.ReactNode;
}

function Toast({ id, variant, children }: toastProps) {
  const { handleDismiss } = useContext(ToastContext);

  const variantStyle = {
    notice: variantNotice,
    warning: variantWarning,
    success: variantSuccess,
    error: variantError,
  };

  return (
    <div
      className={`animate-toast relative flex justify-between items-center text-black gap-4 rounded-lg p-3  w-96   max-w-full  ${
        variantStyle[variant as keyof typeof variantStyle]
      } `}
    >
      <p>{children}</p>
      <button
        onClick={() => handleDismiss(id)}
        className="flex-shrink-0 bg-transparent  cursor-pointer border-none"
      >
        <X size={24} />
      </button>
    </div>
  );
}

export default Toast;
