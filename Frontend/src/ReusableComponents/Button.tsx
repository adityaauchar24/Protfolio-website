import React from "react";

interface ButtonProps {
  name: string;
  routeId?: string;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  name,
  routeId,
  className = "",
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  type = "button",
}) => {
  // Base styles
  const baseStyles = `
    inline-flex items-center justify-center gap-2 xs:gap-3
    font-semibold
    rounded-xl xs:rounded-2xl
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-3 xs:focus:ring-4 focus:ring-opacity-50
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
    disabled:transform-none
    relative overflow-hidden
    touch-manipulation
    select-none
    ${fullWidth ? "w-full" : "w-auto"}
    min-h-[44px]
  `;

  // Variant styles
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-red-600 to-red-500
      hover:from-red-700 hover:to-red-600
      active:from-red-800 active:to-red-700
      text-white
      shadow-lg
      hover:shadow-xl
      hover:scale-105
      focus:ring-red-500/50
      border border-transparent
    `,
    secondary: `
      bg-gradient-to-r from-gray-700 to-gray-900
      hover:from-gray-800 hover:to-gray-700
      active:from-gray-900 active:to-gray-800
      text-white
      shadow-lg
      hover:shadow-xl
      hover:scale-105
      focus:ring-gray-500/50
      border border-transparent
    `,
    outline: `
      border-2 border-gray-300
      text-gray-700
      bg-transparent
      hover:border-red-300
      hover:bg-red-50
      hover:text-red-600
      hover:scale-105
      focus:ring-red-500/50
      active:bg-red-100
    `,
    ghost: `
      border border-transparent
      text-gray-600
      bg-transparent
      hover:bg-gray-100
      hover:text-gray-900
      hover:scale-105
      focus:ring-gray-500/50
      active:bg-gray-200
    `,
  };

  // Size styles
  const sizeStyles = {
    sm: "px-3 xs:px-4 py-2 text-xs xs:text-sm",
    md: "px-4 xs:px-6 py-2 xs:py-3 text-sm xs:text-base",
    lg: "px-6 xs:px-8 py-3 xs:py-4 text-base xs:text-lg",
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-xl xs:rounded-2xl">
      <div className="w-4 h-4 xs:w-5 xs:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  // Ripple effect handler
  const handleRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    const button = event.currentTarget;
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.className = "absolute bg-white/30 rounded-full animate-ripple pointer-events-none";
    
    // Remove existing ripples
    const existingRipples = button.querySelectorAll('.animate-ripple');
    existingRipples.forEach(existingRipple => existingRipple.remove());
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode === button) {
        ripple.remove();
      }
    }, 600);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    handleRipple(event);
    
    if (onClick) {
      onClick(event);
    }
    
    // Smooth scroll for internal links
    if (routeId && routeId.startsWith("#")) {
      event.preventDefault();
      const targetId = routeId.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const headerOffset = 80; // Adjust based on your header height
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
  };

  const buttonContent = (
    <>
      {loading && <LoadingSpinner />}
      
      <span className={`inline-flex items-center gap-2 transition-all duration-300 ${
        loading ? "opacity-0" : "opacity-100"
      }`}>
        {icon && iconPosition === "left" && (
          <span className="shrink-0 flex items-center">
            {icon}
          </span>
        )}
        
        <span className="whitespace-nowrap">
          {name}
        </span>
        
        {icon && iconPosition === "right" && (
          <span className="shrink-0 flex items-center">
            {icon}
          </span>
        )}
      </span>

      {/* Hover arrow for primary and secondary variants */}
      {(variant === "primary" || variant === "secondary") && !icon && (
        <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 xs:group-hover:translate-x-1 transition-all duration-300 text-base xs:text-lg">
          →
        </span>
      )}
    </>
  );

  const buttonClasses = `
    group
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `.replace(/\s+/g, " ").trim();

  // Add CSS for ripple animation
  React.useEffect(() => {
    if (!document.getElementById('button-ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'button-ripple-styles';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 600ms linear;
        }
        
        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .hover-scale-105:hover {
            transform: none;
          }
        }
        
        /* Reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .transition-all,
          .animate-ripple,
          .animate-spin {
            transition: none;
            animation: none;
          }
          .active:scale-95 {
            transform: none;
          }
        }
        
        /* High DPI screens optimization */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .button-shadow {
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
          }
        }
        
        /* Very small screens */
        @media (max-width: 320px) {
          .button-sm-text {
            font-size: 0.75rem;
          }
        }
        
        /* Large screens optimization */
        @media (min-width: 1920px) {
          .button-lg-optimized {
            padding: 1rem 2rem;
          }
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      // Cleanup: remove the style element when component unmounts
      const styleElement = document.getElementById('button-ripple-styles');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  // If routeId is provided and it's an external link, render as anchor
  if (routeId && !routeId.startsWith("#")) {
    return (
      <a
        href={disabled ? undefined : routeId}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
          if (disabled || loading) {
            e.preventDefault();
            return;
          }
          handleRipple(e as unknown as React.MouseEvent<HTMLButtonElement>);
        }}
        aria-disabled={disabled || loading}
        tabIndex={disabled || loading ? -1 : 0}
      >
        {buttonContent}
      </a>
    );
  }

  // Otherwise render as button
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={name}
      aria-busy={loading}
      tabIndex={disabled || loading ? -1 : 0}
    >
      {buttonContent}
    </button>
  );
};

export default Button;