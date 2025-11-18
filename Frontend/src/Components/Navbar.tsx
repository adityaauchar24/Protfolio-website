import React, { useState, useEffect } from "react";
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
}

interface MobileNavItemProps {
  item: NavItem;
  isActive: boolean;
}

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [, setIsScrolled] = useState(false);

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

  // Handle scroll effects and active section detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Detect active section
      const sections = navData.map(item => item.id);
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
    handleScroll(); // Initialize on mount
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navData]);

  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const handleToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLinkClick = (id: string) => {
    setMenuOpen(false);
    
    // Smooth scroll to section
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      });
    }
  };

  // Desktop Navigation Item Component
  const DesktopNavItem = ({ item, isActive }: DesktopNavItemProps) => (
    <a
      href={`#${item.id}`}
      onClick={(e) => {
        e.preventDefault();
        handleLinkClick(item.id);
      }}
      className={`
        group relative
        flex items-center gap-3
        px-4 py-3
        rounded-2xl
        font-medium
        transition-all duration-300 ease-out
        cursor-pointer
        ${
          isActive
            ? `text-white bg-linear-to-r ${item.color} shadow-lg shadow-red-500/25`
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
        }
        hover:scale-105
        active:scale-95
      `}
    >
      <div className={`
        transition-transform duration-300
        ${isActive ? "scale-110 text-white" : "text-gray-500 group-hover:scale-110"}
      `}>
        {item.icon}
      </div>
      
      <span className="whitespace-nowrap">{item.name}</span>
      
      {/* Active indicator */}
      {isActive && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
      )}
      
      {/* Hover effect */}
      {!isActive && (
        <div className={`
          absolute inset-0 rounded-2xl
          bg-linear-to-r ${item.color}
          opacity-0 group-hover:opacity-10
          transition-opacity duration-300
          -z-10
        `} />
      )}
    </a>
  );

  // Mobile Navigation Item Component
  const MobileNavItem = ({ item, isActive }: MobileNavItemProps) => (
    <a
      href={`#${item.id}`}
      onClick={(e) => {
        e.preventDefault();
        handleLinkClick(item.id);
      }}
      className={`
        group
        flex items-center gap-4
        px-6 py-4
        rounded-2xl
        font-medium
        transition-all duration-300 ease-out
        cursor-pointer
        border-2
        ${
          isActive
            ? `text-white bg-linear-to-r ${item.color} border-transparent shadow-lg`
            : "text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50/80"
        }
        active:scale-95
      `}
    >
      <div className={`
        transition-transform duration-300
        ${isActive ? "scale-110 text-white" : "text-gray-500 group-hover:scale-110"}
      `}>
        {item.icon}
      </div>
      
      <span className="text-lg font-semibold">{item.name}</span>
      
      {isActive && (
        <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
      )}
    </a>
  );

  return (
    <nav className="relative">
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-2 p-2 bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-gray-200/50">
        {navData.map((item) => (
          <DesktopNavItem 
            key={item.id} 
            item={item} 
            isActive={activeSection === item.id}
          />
        ))}
      </div>

      {/* Mobile Toggle Button */}
      <div className="lg:hidden">
        <button
          onClick={handleToggle}
          className={`
            flex items-center justify-center
            w-14 h-14
            rounded-2xl
            transition-all duration-300 ease-out
            backdrop-blur-md
            border-2
            ${
              menuOpen
                ? "bg-white border-gray-300 shadow-lg"
                : "bg-white/80 border-gray-200/50 shadow-md hover:shadow-lg"
            }
            hover:scale-105
            active:scale-95
          `}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
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
      <div className={`
        lg:hidden
        fixed inset-0 z-50
        transition-all duration-500 ease-in-out
        ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"}
      `}>
        {/* Backdrop */}
        <div 
          className={`
            absolute inset-0 bg-black/20 backdrop-blur-sm
            transition-opacity duration-500
            ${menuOpen ? "opacity-100" : "opacity-0"}
          `}
          onClick={() => setMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div className={`
          absolute top-4 right-4
          w-80 max-w-[85vw]
          bg-white/95 backdrop-blur-xl
          rounded-3xl
          shadow-2xl
          border border-gray-200/50
          transition-all duration-500 ease-out
          overflow-hidden
          ${menuOpen ? "translate-x-0 opacity-100 scale-100" : "translate-x-10 opacity-0 scale-95"}
        `}>
          {/* Menu Header */}
          <div className="p-6 border-b border-gray-200/50">
            <h2 className="text-2xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Navigation
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Explore my portfolio sections
            </p>
          </div>
          
          {/* Menu Items */}
          <div className="p-4 space-y-3">
            {navData.map((item) => (
              <MobileNavItem 
                key={item.id} 
                item={item} 
                isActive={activeSection === item.id}
              />
            ))}
          </div>
          
          {/* Menu Footer */}
          <div className="p-4 border-t border-gray-200/50">
            <div className="text-center text-sm text-gray-500">
              <p>Let's build something amazing! 🚀</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;