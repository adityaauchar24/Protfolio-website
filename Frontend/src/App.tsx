import { useState, useEffect } from "react";
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
  className = "" 
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

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
      onClick={handleClose}
      role="alert"
    >
      <div className={`
        relative
        min-w-80 max-w-md
        rounded-2xl
        shadow-2xl
        border-2
        backdrop-blur-md
        overflow-hidden
        ${config.bg}
        ${config.border}
        group
      `}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-200/50">
          <div 
            className={`h-full bg-linear-to-r ${config.gradient} transition-all duration-1000 ease-linear`}
            style={{ 
              width: isExiting ? '100%' : '0%',
              transition: `width ${autoClose}ms linear`
            }}
          />
        </div>

        <div className="p-4 flex items-start gap-3">
          {showIcon && (
            <div className="shrink-0 text-lg">
              {config.icon}
            </div>
          )}

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

          {showCloseButton && (
            <button
              onClick={handleClose}
              className="shrink-0 p-1 rounded-lg transition-all duration-200 hover:scale-110 focus:outline-none"
              aria-label="Close notification"
            >
              ✕
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

  const showToast = (message: ToastMessage, options: Partial<Omit<ToastItem, 'id' | 'message'>> = {}) => {
    const id = Date.now().toString();
    const toast: ToastItem = { id, message, ...options };
    
    setToasts(prev => [...prev, toast]);
    
    // Fixed: Check if autoClose is explicitly false, otherwise use the value or default
    if (options.autoClose !== false) {
      const closeTime = typeof options.autoClose === 'number' ? options.autoClose : 5000;
      setTimeout(() => {
        removeToast(id);
      }, closeTime);
    }
    
    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

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
          className={`transform translate-y-[${index * 80}px]`}
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

  useEffect(() => {
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
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { activeSection, scrollProgress };
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

    window.addEventListener("scroll", toggleVisibility);
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
          className="fixed bottom-8 right-8 z-40 w-12 h-12 bg-linear-to-r from-red-600 to-red-500 text-white rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-110 active:scale-95 transition-all duration-300 group"
          aria-label="Scroll to top"
        >
          <div className="transform rotate-180 group-hover:-translate-y-0.5 transition-transform duration-300">
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
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-gray-50 to-white">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
          <div className="w-16 h-16 border-4 border-transparent border-t-red-400 rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <h2 className="text-xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mt-4">
          Aditya Auchar
        </h2>
        <p className="text-gray-600 text-sm mt-2">Portfolio Loading...</p>
      </div>
    </div>
  );
};

// Navigation dots component
const NavigationDots = ({ activeSection }: NavigationDotsProps) => {
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
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-30 hidden lg:flex flex-col gap-4">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => handleDotClick(section.id)}
          className="group flex items-center gap-3"
          aria-label={`Navigate to ${section.label}`}
        >
          <span className="text-xs text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
            {section.label}
          </span>
          <div
            className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
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
  <footer className="bg-linear-to-b from-white to-gray-50 border-t border-gray-200/50 py-8">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-gray-600 mb-2">
          © {new Date().getFullYear()} Aditya Auchar. All rights reserved.
        </p>
        <p className="text-gray-500 text-sm">
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
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
    </div>
  );
}

export default App;