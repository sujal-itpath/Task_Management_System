import { useEffect } from "react";
import { X } from "lucide-react";
import classNames from "classnames";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  showCloseIcon = true,
  width = "max-w-lg",
}) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        className={classNames(
          "bg-white w-full rounded-lg shadow-lg transform transition-all",
          width
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {showCloseIcon && (
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && <div className="px-6 py-3 border-t bg-gray-50">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
