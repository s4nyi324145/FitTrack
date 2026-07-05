"use client";
import React, { useState } from "react";
import { createContext, useContext } from "react";
import { Check, X, Info } from "lucide-react"
type Toast = {
  id: number;
  message: string;
  type: "success" | "error" | "info";
};

//Write the type of the Context for the TS

type ToastContextType = {
  toasts: Toast[];
  showToast: (message: string, type: "success" | "error" | "info") => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
};

export const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };
  const showSuccess = (message: string) => showToast(message, "success");
  const showError = (message: string) => showToast(message, "error");
  const showInfo = (message: string) => showToast(message, "info");

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }

  return (
    <ToastContext
      value={{ toasts, showToast, showSuccess, showInfo, showError }}
    >
      {children}

      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
  {toasts.map((toast) => (
    <div
      key={toast.id}
      className={`
        flex items-center gap-3 px-4 py-3 animate-toast-in rounded-xl shadow-2xl
        border bg-surface/90 backdrop-blur-md font-medium text-sm
        pointer-events-auto min-w-[300px] max-w-[380px]
        transition-all transform
        ${
          toast.type === "success"
            ? "border-green-500/20 text-foreground shadow-green-500/5 bg-gradient-to-r from-green-500/5 to-transparent"
            : toast.type === "error"
            ? "border-red-500/20 text-foreground shadow-red-500/5 bg-gradient-to-r from-red-500/5 to-transparent"
            : "border-blue-500/20 text-foreground shadow-blue-500/5 bg-gradient-to-r from-blue-500/5 to-transparent"
        }
      `}
    >
      {/* Ikon Box */}
      <div
        className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${
          toast.type === "success"
            ? "bg-green-500/10 border-green-500/20 text-green-400"
            : toast.type === "error"
            ? "bg-red-500/10 border-red-500/20 text-red-400"
            : "bg-blue-500/10 border-blue-500/20 text-blue-400"
        }`}
      >
        {toast.type === "success" && <Check size={16} strokeWidth={2.5} />}
        {toast.type === "error" && <X size={16} strokeWidth={2.5} />}
        {toast.type === "info" && <Info size={16} strokeWidth={2.5} />}
      </div>

      {/* Üzenet szövege */}
      <p className="flex-1 leading-snug text-text font-medium">{toast.message}</p>

      {/* Bezáró gomb */}
      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 p-1 rounded-md text-text-muted hover:text-foreground hover:bg-border/50 transition-all cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  ))}
</div>
    </ToastContext>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
