import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

const ToastContext = createContext();

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showToast = useCallback((message, type = "info", duration = 3000) => {
    const id = toastId++;
    const iconMap = {
      success: <CheckCircle className="text-green-500" />,
      error: <XCircle className="text-red-500" />,
      info: <Info className="text-blue-500" />,
      warning: <AlertTriangle className="text-yellow-500" />,
    };

    setToasts((prev) => [...prev, { id, message, type, icon: iconMap[type] }]);

    setTimeout(() => removeToast(id), duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-5 right-5 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-3 bg-white shadow-md border rounded-md px-4 py-2 min-w-[250px]"
          >
            {toast.icon}
            <span className="flex-1 text-sm text-gray-800">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)}>
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);
