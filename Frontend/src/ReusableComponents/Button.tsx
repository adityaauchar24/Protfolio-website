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
}) => {
  // Base styles
  const baseStyles = `
    inline-flex items-center justify-center gap-3
    font-semibold
    rounded-2xl
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-4 focus:ring-opacity-50
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
    relative overflow-hidden
    ${fullWidth ? "w-full" : ""}
  `;

  // Variant styles
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-red-600 to-red-500
      text-white
      shadow-lg
      hover:shadow-xl
      hover:scale-105
      focus:ring-red-500/50
      border border-transparent
    `,
    secondary: `
      bg-gradient-to-r from-gray-700 to-gray-900
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
    `,
    ghost: `
      border border-transparent
      text-gray-600
      bg-transparent
      hover:bg-gray-100
      hover:text-gray-900
      hover:scale-105
      focus:ring-gray-500/50
    `,
  };

  // Size styles
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-2xl">
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  // Ripple effect handler
  const handleRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.className = "absolute bg-white/30 rounded-full animate-ripple";
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      handleRipple(event);
      
      if (onClick) {
        onClick(event);
      }
      
      // Smooth scroll for internal links
      if (routeId && routeId.startsWith("#")) {
        event.preventDefault();
        const targetElement = document.getElementById(routeId.substring(1));
        if (targetElement) {
          targetElement.scrollIntoView({ 
            behavior: "smooth",
            block: "start"
          });
        }
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
          <span className="shrink-0">{icon}</span>
        )}
        {name}
        {icon && iconPosition === "right" && (
          <span className="shrink-0">{icon}</span>
        )}
      </span>

      {/* Hover arrow for primary and secondary variants */}
      {(variant === "primary" || variant === "secondary") && !icon && (
        <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
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

  // If routeId is provided and it's an external link, render as anchor
  if (routeId && !routeId.startsWith("#")) {
    return (
      <a
        href={routeId}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
        onClick={(e) => {
          if (disabled || loading) {
            e.preventDefault();
          }
        }}
      >
        {buttonContent}
      </a>
    );
  }

  // Otherwise render as button
  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={name}
    >
      {buttonContent}
    </button>
  );
};

export default Button;