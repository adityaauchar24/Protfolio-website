import React, { useEffect, useState, useCallback } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";

interface ToastMessage {
  type: "success" | "error" | "warning" | "info";
  mess: string;
}

interface ToastMessProps {
  message: ToastMessage;
  position?: "top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center";
  autoClose?: number | false;
  showCloseButton?: boolean;
  showIcon?: boolean;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const ToastMess: React.FC<ToastMessProps> = ({ 
  message, 
  position = "top-right",
  autoClose = 5000,
  showCloseButton = true,
  showIcon = true,
  onClose,
  className = "",
  style
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 300);
  }, [onClose]);

  useEffect(() => {
    // Enter animation
    const enterTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Auto close timer
    let exitTimer: NodeJS.Timeout;
    if (autoClose !== false) {
      exitTimer = setTimeout(() => {
        handleClose();
      }, autoClose);
    }

    return () => {
      clearTimeout(enterTimer);
      if (exitTimer) clearTimeout(exitTimer);
    };
  }, [autoClose, handleClose]);

  const handleToastClick = (e: React.MouseEvent) => {
    // Prevent closing when clicking on the toast content
    if ((e.target as Element).closest('.toast-content')) {
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
    "top-right": "top-3 xs:top-4 right-3 xs:right-4",
    "top-left": "top-3 xs:top-4 left-3 xs:left-4",
    "top-center": "top-3 xs:top-4 left-1/2 transform -translate-x-1/2",
    "bottom-right": "bottom-3 xs:bottom-4 right-3 xs:right-4",
    "bottom-left": "bottom-3 xs:bottom-4 left-3 xs:left-4",
    "bottom-center": "bottom-3 xs:bottom-4 left-1/2 transform -translate-x-1/2"
  };

  // Responsive width
  const responsiveWidth = "w-[calc(100vw-2rem)] xs:min-w-80 xs:max-w-md";

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed z-50
        ${positionStyles[position]}
        transition-all duration-300 ease-out
        ${isExiting ? 'opacity-0 scale-95 translate-x-4' : 'opacity-100 scale-100 translate-x-0'}
        ${responsiveWidth}
        ${className}
      `}
      onClick={handleToastClick}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      style={style}
    >
      <div className={`
        relative
        rounded-xl xs:rounded-2xl
        shadow-lg xs:shadow-2xl
        border-2
        backdrop-blur-md
        overflow-hidden
        transform transition-all duration-300
        hover:scale-105
        ${config.bg}
        ${config.border}
        group
        touch-manipulation
      `}>
        {/* Progress bar */}
        {autoClose !== false && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-200/50">
            <div 
              className={`
                h-full bg-linear-to-r ${config.gradient}
                transition-all duration-1000 ease-linear
                ${isExiting ? 'w-full' : 'w-0'}
              `}
              style={{ 
                transition: `width ${autoClose}ms linear`,
                width: isExiting ? '100%' : '0%'
              }}
            />
          </div>
        )}

        {/* Main content */}
        <div className="p-3 xs:p-4 flex items-start gap-2 xs:gap-3 toast-content">
          {/* Icon */}
          {showIcon && (
            <div className={`shrink-0 mt-0.5 ${config.iconColor}`}>
              {config.icon}
            </div>
          )}

          {/* Message */}
          <div className="flex-1 min-w-0">
            <div className={`font-semibold text-xs xs:text-sm capitalize mb-1 ${config.text}`}>
              {message.type === "success" ? "Success!" : 
               message.type === "error" ? "Error!" :
               message.type === "warning" ? "Warning!" : "Info!"}
            </div>
            <div className={`text-xs xs:text-sm ${config.text} leading-relaxed wrap-break-word`}>
              {message.mess}
            </div>
          </div>

          {/* Close button */}
          {showCloseButton && (
            <button
              onClick={handleClose}
              className={`
                shrink-0
                p-1
                rounded-lg
                transition-all duration-200
                hover:scale-110
                focus:outline-none focus:ring-2 focus:ring-opacity-50
                ${config.text} hover:bg-black/5
                focus:ring-gray-400
                min-h-8 min-w-8
                flex items-center justify-center
              `}
              aria-label="Close notification"
              type="button"
            >
              <CloseIcon sx={{ fontSize: "1.125rem xs:1.25rem" }} />
            </button>
          )}
        </div>

        {/* Gradient border effect */}
        <div className={`
          absolute inset-0 rounded-xl xs:rounded-2xl border-2 border-transparent
          bg-linear-to-r ${config.gradient}
          opacity-0 group-hover:opacity-10
          transition-opacity duration-300
          pointer-events-none
        `} />
      </div>

      {/* Responsive Styles */}
      <style>{`
        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .hover\\:scale-105:hover {
            transform: none;
          }
          .group-hover\\:opacity-10:hover {
            opacity: 0;
          }
        }

        /* Reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .transition-all,
          .hover\\:scale-105,
          .group-hover\\:opacity-10 {
            transition: none;
          }
          .toast-enter {
            animation: none;
          }
          .toast-exit {
            animation: none;
          }
        }

        /* High DPI optimization */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .backdrop-blur-md {
            -webkit-backdrop-filter: blur(12px);
            backdrop-filter: blur(12px);
          }
        }

        /* Very small screens optimization */
        @media (max-width: 320px) {
          .toast-compact {
            margin: 0.5rem;
          }
        }

        /* Large screen optimization */
        @media (min-width: 1920px) {
          .toast-large {
            max-width: 28rem;
          }
        }

        /* Landscape mode optimization */
        @media (max-height: 500px) and (orientation: landscape) {
          .toast-landscape {
            position: relative;
            margin-bottom: 0.5rem;
          }
        }

        /* Print styles */
        @media print {
          .toast-print {
            display: none;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .toast-dark {
            background-color: rgba(255, 255, 255, 0.95);
          }
        }

        /* Animation keyframes for custom animations */
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes toastSlideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }

        /* Custom animation classes */
        .toast-slide-in {
          animation: toastSlideIn 0.3s ease-out;
        }

        .toast-slide-out {
          animation: toastSlideOut 0.3s ease-in;
        }
      `}</style>
    </div>
  );
};

// Hook for using toast throughout the app
interface ToastOptions {
  position?: ToastMessProps['position'];
  autoClose?: number | false;
  showCloseButton?: boolean;
  showIcon?: boolean;
  className?: string;
}

interface ToastItem {
  id: string;
  message: ToastMessage;
  options: ToastOptions;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: ToastMessage, options: ToastOptions = {}) => {
    const id = Date.now().toString();
    const toast: ToastItem = { id, message, options };
    
    setToasts(prev => [...prev, toast]);
    
    // Auto remove if autoClose is enabled
    if (options.autoClose !== false) {
      setTimeout(() => {
        removeToast(id);
      }, options.autoClose || 5000);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const ToastContainer: React.FC = () => (
    <>
      {toasts.map((toast, index) => (
        <ToastMess
          key={toast.id}
          message={toast.message}
          position={toast.options.position || "top-right"}
          autoClose={toast.options.autoClose}
          showCloseButton={toast.options.showCloseButton}
          showIcon={toast.options.showIcon}
          onClose={() => removeToast(toast.id)}
          className={toast.options.className}
          style={{
            transform: `translateY(${index * 70}px)`,
            zIndex: 50 + index
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