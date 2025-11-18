import React, { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import LaunchIcon from "@mui/icons-material/Launch";

const InfoCard = ({ 
  data, 
  variant = "default",
  size = "md",
  clickable = false,
  showCopyButton = false,
  className = "" 
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Handle copy to clipboard
  const handleCopy = async (event) => {
    event.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(data.detail);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Handle click for clickable cards
  const handleClick = () => {
    if (data.link) {
      if (data.link.startsWith('http')) {
        window.open(data.link, '_blank', 'noopener,noreferrer');
      } else if (data.link.startsWith('mailto:')) {
        window.location.href = data.link;
      } else if (data.link.startsWith('tel:')) {
        window.location.href = data.link;
      }
    } else if (clickable && data.detail) {
      navigator.clipboard.writeText(data.detail);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Variant styles
  const variantStyles = {
    default: `
      bg-white border-gray-200
      hover:border-red-300 hover:shadow-md
    `,
    gradient: `
      bg-gradient-to-br from-gray-50 to-white border-gray-200
      hover:border-red-200 hover:shadow-lg
    `,
    filled: `
      bg-red-50 border-red-100
      hover:border-red-200 hover:bg-red-100
    `,
    outline: `
      bg-transparent border-gray-300
      hover:border-red-400 hover:bg-red-50
    `
  };

  // Size styles
  const sizeStyles = {
    sm: "p-4 rounded-xl",
    md: "p-6 rounded-2xl",
    lg: "p-8 rounded-3xl"
  };

  // Icon size based on card size
  const iconSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  const cardClasses = `
    group
    relative
    border-2
    transition-all duration-300 ease-out
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${clickable || data.link ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}
    ${className}
    backdrop-blur-sm
  `.replace(/\s+/g, ' ').trim();

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role={clickable || data.link ? "button" : "article"}
      tabIndex={clickable || data.link ? 0 : -1}
      onKeyDown={(e) => {
        if ((clickable || data.link) && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Header with icon and title */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`
            p-2 rounded-xl
            bg-gradient-to-r from-red-600 to-red-500
            text-white
            shadow-lg
            transition-transform duration-300
            group-hover:scale-110
            ${iconSizes[size]}
          `}>
            {data?.icon}
          </div>
          <h3 className={`
            font-semibold
            bg-gradient-to-r from-red-700 to-red-500 bg-clip-text text-transparent
            ${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'}
          `}>
            {data.title}
          </h3>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Copy button */}
          {showCopyButton && (
            <button
              onClick={handleCopy}
              className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              title="Copy to clipboard"
            >
              {isCopied ? <CheckIcon sx={{ fontSize: "1rem" }} /> : <ContentCopyIcon sx={{ fontSize: "1rem" }} />}
            </button>
          )}

          {/* External link indicator */}
          {data?.link && data.link.startsWith('http') && (
            <LaunchIcon 
              sx={{ fontSize: "1rem" }} 
              className="text-gray-400"
            />
          )}
        </div>
      </div>

      {/* Detail content */}
      <div className={`
        font-medium text-gray-700
        transition-colors duration-300
        group-hover:text-gray-900
        ${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'}
        break-words
      `}>
        {data.detail}
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-red-500/20 transition-all duration-300 pointer-events-none"></div>

      {/* Click feedback ripple (for clickable cards) */}
      {(clickable || data.link) && (
        <div className="absolute inset-0 rounded-2xl bg-red-500/0 group-active:bg-red-500/10 transition-colors duration-150 pointer-events-none"></div>
      )}

      {/* Success feedback */}
      {isCopied && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full animate-bounce">
          Copied!
        </div>
      )}
    </div>
  );
};

export default InfoCard;