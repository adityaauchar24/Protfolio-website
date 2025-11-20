import React, { useState, useEffect, useCallback } from "react";
import HomeIcon from "@mui/icons-material/Home";
import PsychologyIcon from "@mui/icons-material/Psychology";
import GroupsIcon from "@mui/icons-material/Groups";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import ImportantDevicesIcon from "@mui/icons-material/ImportantDevices";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

interface NavItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface DesktopNavItemProps {
  item: NavItem;
  isActive: boolean;
  onClick: (id: string) => void;
}

interface MobileNavItemProps {
  item: NavItem;
  isActive: boolean;
  onClick: (id: string) => void;
}

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Navigation data with enhanced properties
  const navData: NavItem[] = [
    {
      name: "Home",
      id: "home",
      icon: <HomeIcon sx={{ fontSize: "1.2rem" }} />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "About",
      id: "about",
      icon: <GroupsIcon sx={{ fontSize: "1.2rem" }} />,
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Skills",
      id: "skills",
      icon: <PsychologyIcon sx={{ fontSize: "1.2rem" }} />,
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Projects",
      id: "projects",
      icon: <ImportantDevicesIcon sx={{ fontSize: "1.2rem" }} />,
      color: "from-orange-500 to-red-500",
    },
    {
      name: "Contact",
      id: "contact",
      icon: <PermContactCalendarIcon sx={{ fontSize: "1.2rem" }} />,
      color: "from-indigo-500 to-blue-500",
    },
  ];

  // Detect mobile device and screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle scroll effects and active section detection with throttling
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          
          // Enhanced active section detection
          const sections = navData.map(item => item.id);
          let currentSection = activeSection;
          let minDistance = Infinity;

          sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) {
              const rect = element.getBoundingClientRect();
              const distance = Math.abs(rect.top);
              
              if (distance < minDistance && rect.top <= 150) {
                minDistance = distance;
                currentSection = section;
              }
            }
          });
          
          if (currentSection !== activeSection) {
            setActiveSection(currentSection);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initialize on mount
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection, navData]);

  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "unset";
    };
  }, [menuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [menuOpen]);

  // Touch events for mobile menu
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touchEnd = e.touches[0].clientX;
    const difference = touchStart - touchEnd;
    
    // Swipe right to close
    if (difference > 50 && menuOpen) {
      setMenuOpen(false);
    }
  };

  const handleToggle = useCallback(() => {
    setMenuOpen(prev => !prev);
  }, []);

  const handleLinkClick = useCallback((id: string) => {
    setMenuOpen(false);
    
    // Enhanced smooth scroll with offset
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = isMobile ? 80 : 100;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  }, [isMobile]);

  // Desktop Navigation Item Component
  const DesktopNavItem = React.memo(({ item, isActive, onClick }: DesktopNavItemProps) => (
    <a
      href={`#${item.id}`}
      onClick={(e) => {
        e.preventDefault();
        onClick(item.id);
      }}
      className={`
        group relative
        flex items-center gap-2 lg:gap-3
        px-3 lg:px-4 py-2 lg:py-3
        rounded-xl lg:rounded-2xl
        font-medium
        transition-all duration-300 ease-out
        cursor-pointer
        select-none
        touch-manipulation
        text-sm lg:text-base
        ${
          isActive
            ? `text-white bg-linear-to-r ${item.color} shadow-lg shadow-current/25`
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
        }
        hover:scale-105
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-current focus:ring-opacity-50
      `}
      aria-label={`Navigate to ${item.name} section`}
      aria-current={isActive ? "page" : undefined}
    >
      <div className={`
        transition-transform duration-300 shrink-0
        ${isActive ? "scale-110 text-white" : "text-gray-500 group-hover:scale-110"}
      `}>
        {item.icon}
      </div>
      
      <span className="whitespace-nowrap hidden xl:block">{item.name}</span>
      
      {/* Active indicator */}
      {isActive && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
      )}
      
      {/* Hover effect */}
      {!isActive && (
        <div className={`
          absolute inset-0 rounded-xl lg:rounded-2xl
          bg-linear-to-r ${item.color}
          opacity-0 group-hover:opacity-10
          transition-opacity duration-300
          -z-10
        `} />
      )}
    </a>
  ));

  // Mobile Navigation Item Component
  const MobileNavItem = React.memo(({ item, isActive, onClick }: MobileNavItemProps) => (
    <a
      href={`#${item.id}`}
      onClick={(e) => {
        e.preventDefault();
        onClick(item.id);
      }}
      className={`
        group
        flex items-center gap-3 xs:gap-4
        px-4 xs:px-6 py-3 xs:py-4
        rounded-xl xs:rounded-2xl
        font-medium
        transition-all duration-300 ease-out
        cursor-pointer
        border-2
        select-none
        touch-manipulation
        text-base xs:text-lg
        ${
          isActive
            ? `text-white bg-linear-to-r ${item.color} border-transparent shadow-lg`
            : "text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50/80"
        }
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-current focus:ring-opacity-50
      `}
      aria-label={`Navigate to ${item.name} section`}
      aria-current={isActive ? "page" : undefined}
    >
      <div className={`
        transition-transform duration-300 shrink-0
        ${isActive ? "scale-110 text-white" : "text-gray-500 group-hover:scale-110"}
      `}>
        {item.icon}
      </div>
      
      <span className="font-semibold flex-1">{item.name}</span>
      
      {isActive && (
        <div className="w-2 h-2 bg-white rounded-full animate-pulse shrink-0" />
      )}
    </a>
  ));

  return (
    <nav className="relative" role="navigation" aria-label="Main navigation">
      {/* Desktop Navigation */}
      <div className={`
        hidden lg:flex items-center gap-1 xl:gap-2
        p-2 bg-white/80 backdrop-blur-md rounded-2xl xl:rounded-3xl
        shadow-lg border border-gray-200/50
        transition-all duration-300
        ${isScrolled ? 'scale-95' : 'scale-100'}
      `}>
        {navData.map((item) => (
          <DesktopNavItem 
            key={item.id} 
            item={item} 
            isActive={activeSection === item.id}
            onClick={handleLinkClick}
          />
        ))}
      </div>

      {/* Mobile Toggle Button */}
      <div className="lg:hidden">
        <button
          onClick={handleToggle}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className={`
            flex items-center justify-center
            w-12 h-12 xs:w-14 xs:h-14
            rounded-xl xs:rounded-2xl
            transition-all duration-300 ease-out
            backdrop-blur-md
            border-2
            select-none
            touch-manipulation
            ${
              menuOpen
                ? "bg-white border-gray-300 shadow-lg"
                : "bg-white/80 border-gray-200/50 shadow-md hover:shadow-lg"
            }
            hover:scale-105
            active:scale-95
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
          `}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? (
            <CloseIcon 
              className="text-gray-700 transition-transform duration-300" 
              sx={{ fontSize: "1.5rem" }}
            />
          ) : (
            <MenuIcon 
              className="text-gray-700 transition-transform duration-300" 
              sx={{ fontSize: "1.5rem" }}
            />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        id="mobile-navigation"
        className={`
          lg:hidden
          fixed inset-0 z-50
          transition-all duration-500 ease-in-out
          ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Backdrop */}
        <div 
          className={`
            absolute inset-0 bg-black/20 backdrop-blur-sm
            transition-opacity duration-500
            ${menuOpen ? "opacity-100" : "opacity-0"}
          `}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
        
        {/* Menu Panel */}
        <div className={`
          absolute top-4 right-4 xs:right-6
          w-[calc(100vw-2rem)] xs:w-80 max-w-sm
          bg-white/95 backdrop-blur-xl
          rounded-2xl xs:rounded-3xl
          shadow-2xl
          border border-gray-200/50
          transition-all duration-500 ease-out
          overflow-hidden
          max-h-[calc(100vh-2rem)]
          flex flex-col
          ${menuOpen ? "translate-x-0 opacity-100 scale-100" : "translate-x-10 opacity-0 scale-95"}
        `}>
          {/* Menu Header */}
          <div className="p-4 xs:p-6 border-b border-gray-200/50 shrink-0">
            <h2 className="text-xl xs:text-2xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Navigation
            </h2>
            <p className="text-gray-500 text-xs xs:text-sm mt-1">
              Explore my portfolio sections
            </p>
          </div>
          
          {/* Menu Items */}
          <div className="p-3 xs:p-4 space-y-2 xs:space-y-3 flex-1 overflow-y-auto">
            {navData.map((item) => (
              <MobileNavItem 
                key={item.id} 
                item={item} 
                isActive={activeSection === item.id}
                onClick={handleLinkClick}
              />
            ))}
          </div>
          
          {/* Menu Footer */}
          <div className="p-3 xs:p-4 border-t border-gray-200/50 shrink-0">
            <div className="text-center text-xs xs:text-sm text-gray-500">
              <p>Let's build something amazing! 🚀</p>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        /* Prevent zoom on iOS for inputs */
        @media (max-width: 768px) {
          input, select, textarea {
            font-size: 16px;
          }
        }
        
        /* Enhanced touch interactions */
        @media (hover: none) and (pointer: coarse) {
          .hover-scale:hover {
            transform: none;
          }
        }
        
        /* High DPI optimization */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .nav-blur {
            -webkit-backdrop-filter: blur(12px);
            backdrop-filter: blur(12px);
          }
        }
        
        /* Reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
          }
        }
        
        /* Large screen optimization */
        @media (min-width: 1920px) {
          .desktop-nav {
            padding: 1rem 1.5rem;
          }
        }
        
        /* Very small screens */
        @media (max-width: 320px) {
          .mobile-menu {
            width: calc(100vw - 1rem);
            right: 0.5rem;
            top: 0.5rem;
          }
        }
        
        /* Extra small devices optimization */
        @media (max-width: 360px) {
          .mobile-nav-item {
            padding: 0.75rem 1rem;
          }
        }
        
        /* Tablet optimization */
        @media (min-width: 768px) and (max-width: 1023px) {
          .tablet-optimized {
            font-size: 0.9rem;
          }
        }
        
        /* Ultra-wide screens */
        @media (min-width: 2000px) {
          .desktop-nav {
            max-width: 80vw;
            margin: 0 auto;
          }
        }
        
        /* Landscape mode optimization */
        @media (max-height: 500px) and (orientation: landscape) {
          .mobile-menu-panel {
            max-height: 90vh;
            top: 2vh;
          }
          
          .mobile-menu-items {
            max-height: 60vh;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;