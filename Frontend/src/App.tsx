import { useState, useEffect, useCallback } from "react";
import Header from "./Components/Header";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Skills from "./Pages/Skills";
import Projects from "./Pages/Projects";
import Contact from "./Pages/Contact";

// TypeScript interfaces
interface ToastMessage {
  type: "success" | "error" | "warning" | "info";
  mess: string;
}

interface ToastProps {
  message: ToastMessage;
  position?: "top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center";
  autoClose?: number;
  showCloseButton?: boolean;
  showIcon?: boolean;
  onClose: () => void;
  className?: string;
  style?: React.CSSProperties;
}

interface ToastItem {
  id: string;
  message: ToastMessage;
  position?: string;
  autoClose?: number | false;
  showCloseButton?: boolean;
  showIcon?: boolean;
}

interface NavigationDotsProps {
  activeSection: string;
}

interface ProgressBarProps {
  progress: number;
}

// ToastMess Component
const ToastMess = ({ 
  message, 
  position = "top-right",
  autoClose = 5000,
  showCloseButton = true,
  showIcon = true,
  onClose,
  className = "",
  style
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    if (autoClose) {
      const exitTimer = setTimeout(() => {
        handleClose();
      }, autoClose);

      return () => {
        clearTimeout(enterTimer);
        clearTimeout(exitTimer);
      };
    }

    return () => clearTimeout(enterTimer);
  }, [autoClose]);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 300);
  }, [onClose]);

  const toastConfig = {
    success: {
      icon: "✅",
      gradient: "from-green-500 to-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
    },
    error: {
      icon: "❌",
      gradient: "from-red-500 to-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
    },
    warning: {
      icon: "⚠️",
      gradient: "from-yellow-500 to-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
    },
    info: {
      icon: "ℹ️",
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
    }
  };

  const config = toastConfig[message.type] || toastConfig.info;

  const positionStyles: Record<string, string> = {
    "top-right": "top-3 xs:top-4 right-3 xs:right-4",
    "top-left": "top-3 xs:top-4 left-3 xs:left-4",
    "top-center": "top-3 xs:top-4 left-1/2 transform -translate-x-1/2",
    "bottom-right": "bottom-3 xs:bottom-4 right-3 xs:right-4",
    "bottom-left": "bottom-3 xs:bottom-4 left-3 xs:left-4",
    "bottom-center": "bottom-3 xs:bottom-4 left-1/2 transform -translate-x-1/2"
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
      onClick={handleClose}
      role="alert"
      aria-live="polite"
      style={style}
    >
      <div className={`
        relative
        w-80 xs:w-96 max-w-[90vw]
        rounded-xl xs:rounded-2xl
        shadow-2xl
        border-2
        backdrop-blur-md
        overflow-hidden
        ${config.bg}
        ${config.border}
        group
        touch-manipulation
      `}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-200/50">
          {autoClose && (
            <div 
              className={`h-full bg-linear-to-r ${config.gradient} transition-all duration-1000 ease-linear`}
              style={{ 
                width: isExiting ? '100%' : '0%',
                transition: `width ${autoClose}ms linear`
              }}
            />
          )}
        </div>

        <div className="p-3 xs:p-4 flex items-start gap-2 xs:gap-3">
          {showIcon && (
            <div className="shrink-0 text-base xs:text-lg flex items-center">
              {config.icon}
            </div>
          )}

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

          {showCloseButton && (
            <button
              onClick={handleClose}
              className="shrink-0 p-1 rounded-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-current focus:ring-opacity-50 min-h-8 min-w-8 flex items-center justify-center"
              aria-label="Close notification"
              type="button"
            >
              <span className="text-sm">✕</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// useToast Hook
const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: ToastMessage, options: Partial<Omit<ToastItem, 'id' | 'message'>> = {}) => {
    const id = Date.now().toString();
    const toast: ToastItem = { id, message, ...options };
    
    setToasts(prev => [...prev, toast]);
    
    if (options.autoClose !== false) {
      const closeTime = typeof options.autoClose === 'number' ? options.autoClose : 5000;
      setTimeout(() => {
        removeToast(id);
      }, closeTime);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const ToastContainer = () => (
    <>
      {toasts.map((toast, index) => (
        <ToastMess
          key={toast.id}
          message={toast.message}
          position={toast.position as ToastProps['position'] || "top-right"}
          autoClose={toast.autoClose === false ? undefined : (toast.autoClose || 5000)}
          showCloseButton={toast.showCloseButton}
          showIcon={toast.showIcon}
          onClose={() => removeToast(toast.id)}
          style={{ transform: `translateY(${index * 70}px)` }}
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

// Custom hook for scroll effects and section tracking
const useScrollEffects = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleScroll = () => {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset;
      const trackLength = docHeight - winHeight;
      const progress = Math.floor((scrollTop / trackLength) * 100);
      setScrollProgress(progress);

      const sections = ["home", "about", "skills", "projects", "contact"];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return { activeSection, scrollProgress, isMobile };
};

// Scroll to top component
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 xs:bottom-6 sm:bottom-8 right-4 xs:right-6 sm:right-8 z-40 w-10 h-10 xs:w-12 xs:h-12 bg-linear-to-r from-red-600 to-red-500 text-white rounded-xl xs:rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-110 active:scale-95 transition-all duration-300 group touch-manipulation flex items-center justify-center focus:outline-none focus:ring-3 focus:ring-red-500/50"
          aria-label="Scroll to top"
          type="button"
        >
          <div className="transform rotate-180 group-hover:-translate-y-0.5 transition-transform duration-300 text-lg xs:text-xl">
            ↓
          </div>
        </button>
      )}
    </>
  );
};

// Loading screen component
const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-gray-50 to-white">
      <div className="text-center">
        <div className="relative">
          <div className="w-12 h-12 xs:w-16 xs:h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-3 xs:mb-4"></div>
          <div className="w-12 h-12 xs:w-16 xs:h-16 border-4 border-transparent border-t-red-400 rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <h2 className="text-lg xs:text-xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mt-3 xs:mt-4">
          Aditya Auchar
        </h2>
        <p className="text-gray-600 text-xs xs:text-sm mt-1 xs:mt-2">Portfolio Loading...</p>
      </div>
    </div>
  );
};

// Navigation dots component
const NavigationDots = ({ activeSection }: NavigationDotsProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sections = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" }
  ];

  const handleDotClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = isMobile ? 80 : 100;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Hide on mobile devices
  if (isMobile) return null;

  return (
    <div className="fixed right-4 xs:right-6 sm:right-8 top-1/2 transform -translate-y-1/2 z-30 hidden lg:flex flex-col gap-3 xs:gap-4">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => handleDotClick(section.id)}
          className="group flex items-center gap-2 xs:gap-3 touch-manipulation focus:outline-none focus:ring-2 focus:ring-red-500/50 rounded-lg p-1"
          aria-label={`Navigate to ${section.label}`}
          type="button"
        >
          <span className="text-xs text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0 whitespace-nowrap">
            {section.label}
          </span>
          <div
            className={`w-2 h-2 xs:w-3 xs:h-3 rounded-full border-2 transition-all duration-300 ${
              activeSection === section.id
                ? "bg-red-600 border-red-600 scale-125"
                : "bg-transparent border-gray-400 group-hover:border-red-400 group-hover:scale-110"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

// Progress bar component
const ProgressBar = ({ progress }: ProgressBarProps) => (
  <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-40">
    <div
      className="h-full bg-linear-to-r from-red-600 to-red-400 transition-all duration-300 ease-out"
      style={{ width: `${progress}%` }}
    />
  </div>
);

// Footer component
const Footer = () => (
  <footer className="bg-linear-to-b from-white to-gray-50 border-t border-gray-200/50 py-6 xs:py-8">
    <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div className="text-center">
        <p className="text-gray-600 text-sm xs:text-base mb-1 xs:mb-2">
          © {new Date().getFullYear()} Aditya Auchar. All rights reserved.
        </p>
        <p className="text-gray-500 text-xs xs:text-sm">
          Crafted with ❤️ using React & Tailwind CSS
        </p>
      </div>
    </div>
  </footer>
);

function App() {
  const { activeSection, scrollProgress } = useScrollEffects();
  const { ToastContainer } = useToast();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white">
      {/* Loading Screen */}
      <LoadingScreen />

      {/* Progress Bar */}
      <ProgressBar progress={scrollProgress} />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/50 supports-backdrop-blur:bg-white/80">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Header />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {/* Navigation Dots */}
        <NavigationDots activeSection={activeSection} />

        {/* Sections */}
        <section id="home">
          <Home />
        </section>

        <section id="about">
          <About />
        </section>

        <section id="skills">
          <Skills />
        </section>

        <section id="projects">
          <Projects />
        </section>

        <section id="contact">
          <Contact />
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top */}
      <ScrollToTop />

      {/* Toast Container */}
      <ToastContainer />

      {/* Responsive Styles */}
      <style>{`
        /* Prevent zoom on iOS for inputs */
        @media (max-width: 768px) {
          input, select, textarea {
            font-size: 16px;
          }
        }
        
        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .hover-scale:hover {
            transform: none;
          }
          .hover\\:scale-110:hover {
            transform: none;
          }
          .group-hover\\:scale-110:hover {
            transform: none;
          }
        }
        
        /* Reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .transition-all,
          .animate-spin,
          .group-hover\\:scale-110:hover,
          .hover\\:scale-110:hover {
            transition: none;
            animation: none;
          }
          .animate-spin {
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
        
        /* Very small screens */
        @media (max-width: 320px) {
          .container {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
        }

        /* Large screen optimization */
        @media (min-width: 1920px) {
          .app-container {
            max-width: 90rem;
            margin: 0 auto;
          }
        }

        /* Landscape mode optimization */
        @media (max-height: 500px) and (orientation: landscape) {
          .navigation-dots {
            display: none;
          }
        }

        /* Print styles */
        @media print {
          .scroll-to-top,
          .navigation-dots,
          .progress-bar,
          .toast-container {
            display: none !important;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .app-dark {
            background: linear-gradient(to bottom right, #1f2937, #111827);
          }
        }

        /* Reduced data mode */
        @media (prefers-reduced-data: reduce) {
          .background-animations {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default App;