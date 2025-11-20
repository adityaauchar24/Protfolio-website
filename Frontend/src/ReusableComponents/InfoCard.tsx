import React, { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import LaunchIcon from "@mui/icons-material/Launch";

interface InfoCardData {
  title: string;
  detail: string;
  icon?: React.ReactNode;
  link?: string;
}

interface InfoCardProps {
  data: InfoCardData;
  variant?: "default" | "gradient" | "filled" | "outline";
  size?: "sm" | "md" | "lg";
  clickable?: boolean;
  showCopyButton?: boolean;
  className?: string;
  onCopy?: (text: string) => void;
  onClick?: (data: InfoCardData) => void;
}

const InfoCard: React.FC<InfoCardProps> = ({ 
  data, 
  variant = "default",
  size = "md",
  clickable = false,
  showCopyButton = false,
  className = "",
  onCopy,
  onClick
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [, setIsHovered] = useState(false);

  // Handle copy to clipboard
  const handleCopy = async (event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(data.detail);
      setIsCopied(true);
      
      // Call onCopy callback if provided
      if (onCopy) {
        onCopy(data.detail);
      }
      
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = data.detail;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  // Handle click for clickable cards
  const handleClick = (event: React.MouseEvent) => {
    if (onClick) {
      onClick(data);
    }

    if (data.link) {
      if (data.link.startsWith('http')) {
        window.open(data.link, '_blank', 'noopener,noreferrer');
      } else if (data.link.startsWith('mailto:') || data.link.startsWith('tel:')) {
        window.location.href = data.link;
      }
    } else if (clickable && data.detail && !showCopyButton) {
      // Auto-copy if clickable and no explicit copy button
      handleCopy(event);
    }
  };

  // Handle keyboard events
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((clickable || data.link) && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      handleClick(event as unknown as React.MouseEvent);
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
    sm: "p-3 xs:p-4 rounded-lg xs:rounded-xl",
    md: "p-4 xs:p-6 rounded-xl xs:rounded-2xl",
    lg: "p-6 xs:p-8 rounded-2xl xs:rounded-3xl"
  };

  // Icon size based on card size
  const iconSizes = {
    sm: "text-base xs:text-lg",
    md: "text-lg xs:text-xl",
    lg: "text-xl xs:text-2xl"
  };

  // Title size based on card size
  const titleSizes = {
    sm: "text-xs xs:text-sm",
    md: "text-sm xs:text-base",
    lg: "text-base xs:text-lg"
  };

  // Detail size based on card size
  const detailSizes = {
    sm: "text-xs xs:text-sm",
    md: "text-sm xs:text-base",
    lg: "text-base xs:text-lg"
  };

  const cardClasses = `
    group
    relative
    border-2
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-3 focus:ring-red-500/50
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${(clickable || data.link) ? 'cursor-pointer hover:scale-105 active:scale-95 focus:scale-105' : ''}
    ${className}
    backdrop-blur-sm
    touch-manipulation
    select-none
  `.replace(/\s+/g, ' ').trim();

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      role={(clickable || data.link) ? "button" : "article"}
      tabIndex={(clickable || data.link) ? 0 : -1}
      aria-label={data.title}
    >
      {/* Header with icon and title */}
      <div className="flex items-center justify-between mb-2 xs:mb-3">
        <div className="flex items-center gap-2 xs:gap-3 min-w-0 flex-1">
          <div className={`
            p-1.5 xs:p-2 rounded-lg xs:rounded-xl
            bg-linear-to-r from-red-600 to-red-500
            text-white
            shadow-lg
            transition-transform duration-300
            group-hover:scale-110
            shrink-0
            ${iconSizes[size]}
          `}>
            {data?.icon}
          </div>
          <h3 className={`
            font-semibold
            bg-linear-to-r from-red-700 to-red-500 bg-clip-text text-transparent
            ${titleSizes[size]}
            truncate
            min-w-0
          `}>
            {data.title}
          </h3>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 shrink-0 ml-2">
          {/* Copy button */}
          {showCopyButton && (
            <button
              onClick={handleCopy}
              className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              title="Copy to clipboard"
              aria-label="Copy to clipboard"
              type="button"
            >
              {isCopied ? 
                <CheckIcon sx={{ fontSize: "1rem" }} className="text-green-500" /> : 
                <ContentCopyIcon sx={{ fontSize: "1rem" }} />
              }
            </button>
          )}

          {/* External link indicator */}
          {data?.link && data.link.startsWith('http') && (
            <LaunchIcon 
              sx={{ fontSize: "1rem" }} 
              className="text-gray-400 shrink-0"
            />
          )}
        </div>
      </div>

      {/* Detail content */}
      <div className={`
        font-medium text-gray-700
        transition-colors duration-300
        group-hover:text-gray-900
        ${detailSizes[size]}
        wrap-break-word
        overflow-hidden
        line-clamp-2 xs:line-clamp-3
      `}>
        {data.detail}
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-red-500/20 group-focus:border-red-500/30 transition-all duration-300 pointer-events-none"></div>

      {/* Click feedback ripple (for clickable cards) */}
      {(clickable || data.link) && (
        <div className="absolute inset-0 rounded-2xl bg-red-500/0 group-active:bg-red-500/10 transition-colors duration-150 pointer-events-none"></div>
      )}

      {/* Success feedback */}
      {isCopied && (
        <div className="absolute top-1 xs:top-2 right-1 xs:right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full animate-bounce shadow-lg">
          Copied!
        </div>
      )}

      {/* Responsive Styles */}
      <style>{`
        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .group-hover\\:scale-105:hover {
            transform: none;
          }
          .group-hover\\:scale-110:hover {
            transform: none;
          }
          .group-hover\\:opacity-100:hover {
            opacity: 0.7;
          }
        }

        /* Reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .transition-all,
          .group-hover\\:scale-105,
          .group-hover\\:scale-110 {
            transition: none;
          }
          .animate-bounce {
            animation: none;
          }
        }

        /* High DPI optimization */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .backdrop-blur-sm {
            -webkit-backdrop-filter: blur(8px);
            backdrop-filter: blur(8px);
          }
        }

        /* Very small screens optimization */
        @media (max-width: 320px) {
          .info-card-compact {
            padding: 0.75rem;
          }
        }

        /* Large screen optimization */
        @media (min-width: 1920px) {
          .info-card-large {
            padding: 2rem;
          }
        }

        /* Line clamp utility */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Focus styles for better accessibility */
        .focus\\:scale-105:focus {
          transform: scale(1.05);
        }

        /* Print styles */
        @media print {
          .group-hover\\:scale-105,
          .group-hover\\:scale-110,
          .transition-all {
            transform: none !important;
            transition: none !important;
          }
          
          .backdrop-blur-sm {
            backdrop-filter: none;
          }
        }
      `}</style>
    </div>
  );
};

export default InfoCard;