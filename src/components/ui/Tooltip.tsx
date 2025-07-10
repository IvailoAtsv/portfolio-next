'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}

export default function Tooltip({
  content,
  children,
  delay = 500,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  let timeout: NodeJS.Timeout;

  const showTooltip = () => {
    timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeout);
    setIsVisible(false);
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className="cursor-help"
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 transform"
          >
            <div className="bg-card border-border/80 rounded-lg border px-3 py-2 shadow-lg backdrop-blur-sm">
              <div className="text-foreground text-sm whitespace-nowrap">
                {content}
              </div>
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 transform">
              <div className="bg-card border-border/80 h-2 w-2 rotate-45 transform border-r border-b"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
