import { useState, useEffect } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Navigation items data
  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  // Handle scroll effects and active section
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = navItems.map(item => item.href.substring(1));
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

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  // Handle mobile menu body scroll lock
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Smooth scroll to section
  const handleNavigation = (href: string, isMobile = false) => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
    
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigation component for both desktop and mobile
  const Navigation = ({ isMobile = false }) => (
    <nav 
      className={`
        ${isMobile 
          ? 'flex flex-col space-y-3' 
          : 'hidden lg:flex items-center space-x-1'
        }
      `}
      role="navigation"
      aria-label={isMobile ? "Mobile navigation" : "Main navigation"}
    >
      {navItems.map((item) => {
        const isActive = activeSection === item.href.substring(1);
        
        return (
          <a
            key={item.name}
            href={item.href}
            onClick={(e) => {
              e.preventDefault();
              handleNavigation(item.href, isMobile);
            }}
            className={`
              group
              transition-all duration-300 ease-out
              font-medium
              rounded-xl
              border border-transparent
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
              ${
                isMobile
                  ? `
                    flex items-center justify-center
                    py-4 px-6
                    text-gray-700 hover:text-red-600
                    hover:bg-red-50
                    hover:border-red-100
                    text-lg
                    ${isActive ? 'bg-red-50 text-red-600 border-red-200' : ''}
                  `
                  : `
                    flex items-center
                    py-3 px-4
                    text-gray-600 hover:text-red-600
                    hover:bg-red-50
                    hover:border-red-100
                    relative
                    ${isActive ? 'text-red-600 bg-red-50 border-red-200' : ''}
                  `
              }
            `}
            aria-label={`Navigate to ${item.name} section`}
            aria-current={isActive ? 'page' : undefined}
          >
            <span>{item.name}</span>
            
            {/* Desktop active indicator */}
            {!isMobile && (
              <span className={`
                absolute bottom-0 left-1/2 transform -translate-x-1/2
                h-0.5 bg-gradient-to-r from-red-600 to-red-400
                transition-all duration-300
                ${isActive ? 'w-3/4' : 'w-0 group-hover:w-3/4'}
              `} />
            )}
            
            {/* Mobile active indicator */}
            {isMobile && isActive && (
              <span className="w-2 h-2 bg-red-500 rounded-full ml-2" />
            )}
          </a>
        );
      })}
    </nav>
  );

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 
        transition-all duration-500 ease-out
        border-b
        ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-3 border-gray-200/30' 
            : 'bg-white/90 backdrop-blur-sm py-4 border-transparent'
        }
        ${
          isMobileMenuOpen 
            ? 'bg-white border-gray-200/50' 
            : ''
        }
      `}
      role="banner"
      aria-label="Main navigation header"
    >
      {/* Main Header Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo/Brand Section */}
          <div className="flex items-center space-x-3">
            <div 
              className="
                flex items-center space-x-2
                text-xl sm:text-2xl font-bold 
                cursor-pointer
                select-none
                group
              "
              onClick={() => handleNavigation('#home')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleNavigation('#home');
                }
              }}
            >
              {/* Brand Text */}
              <div className="
                bg-gradient-to-r from-red-700 via-red-600 to-red-500 
                bg-clip-text text-transparent 
                transition-all duration-300 
                group-hover:scale-105
              ">
                <span className="text-red-700 drop-shadow-sm">Dev.</span>
                <span className="text-gray-900 font-semibold">Portfolio</span>
              </div>
            </div>
            
            {/* Status Indicator */}
            <div 
              className="
                relative
                w-2 h-2 
                bg-gradient-to-r from-green-400 to-green-500 
                rounded-full 
                shadow-sm
                hidden sm:block
                animate-pulse
              " 
              title="Available for work"
              aria-label="Available for work"
            />
          </div>

          {/* Desktop Navigation */}
          <Navigation />

          {/* Mobile Menu Button */}
          <button
            className="
              lg:hidden
              flex flex-col items-center justify-center
              w-12 h-12
              rounded-2xl
              transition-all duration-300
              hover:bg-gray-100
              active:bg-gray-200
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
              group
            "
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={`
              block w-6 h-0.5 bg-gray-700 rounded-full
              transition-all duration-300
              group-hover:bg-red-600
              ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5 bg-red-600' : ''}
            `} 
            />
            <span className={`
              block w-6 h-0.5 bg-gray-700 rounded-full
              transition-all duration-300
              my-1.5
              group-hover:bg-red-600
              ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}
            `} 
            />
            <span className={`
              block w-6 h-0.5 bg-gray-700 rounded-full
              transition-all duration-300
              group-hover:bg-red-600
              ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5 bg-red-600' : ''}
            `} 
            />
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`
          lg:hidden
          overflow-hidden
          transition-all duration-500 ease-in-out
          ${
            isMobileMenuOpen 
              ? 'max-h-96 opacity-100 py-4 mt-2' 
              : 'max-h-0 opacity-0'
          }
        `}>
          <div className="
            bg-white/90 backdrop-blur-md
            rounded-2xl
            p-6
            shadow-xl
            border border-gray-200/50
          ">
            <Navigation isMobile={true} />
            
            {/* Additional Mobile Menu Footer */}
            <div className="mt-6 pt-6 border-t border-gray-200/50">
              <div className="flex items-center justify-center text-sm text-gray-500">
                <span>Available for Opportunities</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;