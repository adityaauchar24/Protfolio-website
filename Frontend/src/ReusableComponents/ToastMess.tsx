import React, { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";

const ToastMess = ({ 
  message, 
  position = "top-right",
  autoClose = 5000,
  showCloseButton = true,
  showIcon = true,
  onClose,
  className = "" 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Enter animation
    const enterTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Auto close timer
    const exitTimer = setTimeout(() => {
      handleClose();
    }, autoClose);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, [autoClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 300);
  };

  const handleToastClick = (e) => {
    // Prevent closing when clicking on the toast content
    if (e.target.closest('.toast-content')) {
      return;
    }
    handleClose();
  };

  // Toast type configurations
  const toastConfig = {
    success: {
      icon: <CheckCircleIcon sx={{ fontSize: "1.5rem" }} />,
      gradient: "from-green-500 to-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      iconColor: "text-green-500"
    },
    error: {
      icon: <ErrorIcon sx={{ fontSize: "1.5rem" }} />,
      gradient: "from-red-500 to-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      iconColor: "text-red-500"
    },
    warning: {
      icon: <WarningIcon sx={{ fontSize: "1.5rem" }} />,
      gradient: "from-yellow-500 to-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      iconColor: "text-yellow-500"
    },
    info: {
      icon: <InfoIcon sx={{ fontSize: "1.5rem" }} />,
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      iconColor: "text-blue-500"
    }
  };

  const config = toastConfig[message.type] || toastConfig.info;

  // Position styles
  const positionStyles = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2"
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed z-50
        ${positionStyles[position]}
        transition-all duration-300 ease-out
        ${isExiting ? 'opacity-0 scale-95 translate-x-4' : 'opacity-100 scale-100 translate-x-0'}
        ${className}
      `}
      onClick={handleToastClick}
      role="alert"
      aria-live="polite"
    >
      <div className={`
        relative
        min-w-80 max-w-md
        rounded-2xl
        shadow-2xl
        border-2
        backdrop-blur-md
        overflow-hidden
        transform transition-all duration-300
        hover:scale-105
        ${config.bg}
        ${config.border}
        group
      `}>
        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-200/50">
          <div 
            className={`
              h-full bg-gradient-to-r ${config.gradient}
              transition-all duration-1000 ease-linear
              ${isExiting ? 'w-full' : 'w-0'}
            `}
            style={{ 
              transition: `width ${autoClose}ms linear`,
              width: isExiting ? '100%' : '0%'
            }}
          />
        </div>

        {/* Main content */}
        <div className="p-4 flex items-start gap-3 toast-content">
          {/* Icon */}
          {showIcon && (
            <div className={`flex-shrink-0 mt-0.5 ${config.iconColor}`}>
              {config.icon}
            </div>
          )}

          {/* Message */}
          <div className="flex-1 min-w-0">
            <div className={`font-semibold text-sm capitalize mb-1 ${config.text}`}>
              {message.type === "success" ? "Success!" : 
               message.type === "error" ? "Error!" :
               message.type === "warning" ? "Warning!" : "Info!"}
            </div>
            <div className={`text-sm ${config.text} leading-relaxed`}>
              {message.mess}
            </div>
          </div>

          {/* Close button */}
          {showCloseButton && (
            <button
              onClick={handleClose}
              className={`
                flex-shrink-0
                p-1
                rounded-lg
                transition-all duration-200
                hover:scale-110
                focus:outline-none focus:ring-2 focus:ring-opacity-50
                ${config.text} hover:bg-black/5
                focus:ring-gray-400
              `}
              aria-label="Close notification"
            >
              <CloseIcon sx={{ fontSize: "1.25rem" }} />
            </button>
          )}
        </div>

        {/* Gradient border effect */}
        <div className={`
          absolute inset-0 rounded-2xl border-2 border-transparent
          bg-gradient-to-r ${config.gradient}
          opacity-0 group-hover:opacity-10
          transition-opacity duration-300
          pointer-events-none
        `} />
      </div>
    </div>
  );
};

// Hook for using toast throughout the app
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, options = {}) => {
    const id = Date.now().toString();
    const toast = { id, message, ...options };
    
    setToasts(prev => [...prev, toast]);
    
    // Auto remove if autoClose is enabled
    if (options.autoClose !== false) {
      setTimeout(() => {
        removeToast(id);
      }, options.autoClose || 5000);
    }
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <>
      {toasts.map((toast, index) => (
        <ToastMess
          key={toast.id}
          message={toast.message}
          position={toast.position || "top-right"}
          autoClose={toast.autoClose}
          showCloseButton={toast.showCloseButton}
          showIcon={toast.showIcon}
          onClose={() => removeToast(toast.id)}
          className={toast.className}
          style={{
            transform: `translateY(${index * 80}px)`
          }}
        />
      ))}
    </>
  );

  return {
    showToast,
    removeToast,
    ToastContainer
  };
};

export default ToastMess;